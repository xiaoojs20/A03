// pages/forum/post-detail/post-detail.js
Page({
  data: {
    post: {}, // 帖子数据
    isLiked: false, // 初始未点赞状态
    comments: [], // 评论数据，可根据需要从后端获取
    commentInput: ''
  },

  onLoad(options) {
    if (options.id) {
      this.loadPostDetail(options.id);
    }
  },

  loadPostDetail(postId) {
    const that = this;
    // 获取帖子详情
    wx.request({
      url: 'http://43.143.205.76:8000/post/get_post_by_postid/',
      data: { post_id: postId },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.msg === 'get_post_by_postid ok') {
          that.setData({ post: res.data.post_info });
          // 获取帖子的评论
          that.loadComments(postId);
        } else {
          console.error('获取帖子详情失败:', res);
        }
      },
      fail: (err) => {
        console.error('请求帖子详情失败', err);
      }
    });
  },
  
  // 新增函数用于加载评论
  async loadComments(postId) {
    const that = this;
    wx.request({
      url: 'http://43.143.205.76:8000/post/get_n_latest_comments/',
      data: { post_id: postId, n: 10 },
      success: async (res) => {
        if (res.statusCode === 200 && res.data && res.data.msg === 'get_n_latest_comments ok') {
          const commentsWithAuthor = await Promise.all(res.data.posts.map(async (comment) => {
            try {
              const authorNickname = await that.getUserInfo(comment.user_id);
              const cleanedDetail = extractCommentContent(comment.detail);
              return { ...comment, author: authorNickname, detail: cleanedDetail };
            } catch (error) {
              console.error(error);
              return { ...comment, author: '未知用户', detail: extractCommentContent(comment.detail) };
            }
          }));
  
          that.setData({ comments: commentsWithAuthor });
        } else {
          console.error('获取评论失败:', res);
        }
      },
      fail: (err) => {
        console.error('请求评论失败', err);
      }
    });
  },

  submitComment: function() {
    const that = this;
    const currentUserId = 'o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q'; 
    const postId = this.data.post.post_id; // 从帖子信息中获取 post_id
    const commentDetail = this.data.commentInput; // 从页面数据中获取评论内容

    // 检查评论内容是否为空
    if (!commentDetail.trim()) {
      wx.showToast({
        title: '评论内容不能为空',
        icon: 'none'
      });
      return;
    }

    wx.request({
      url: 'http://43.143.205.76:8000/post/create_comment/',
      method: 'POST',
      data: {
        user_id: currentUserId,
        post_id: postId,
        detail: commentDetail
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (res.statusCode === 200) {
          console.log('评论发送成功');
          that.loadPostDetail(postId); // 重新加载帖子详情，包括新的评论
          that.setData({ commentInput: '' }); // 清空评论输入框
        } else {
          console.error('发送评论失败:', res);
        }
      },
      fail: function(err) {
        console.error('请求发送评论接口失败:', err);
      }
    });
  },

  // 用于双向绑定评论输入框的数据
  bindCommentInput: function(e) {
    this.setData({
      commentInput: e.detail.value
    });
  },

  onShareAppMessage: function () {
    return {
      title: this.data.post.title, // 使用帖子标题作为分享标题
      path: '/pages/forum/post-detail/post-detail?id=' + this.data.post.id // 分享链接指向当前帖子
      
    };
  },
  navigateToPersonalInfo: function() {
    const userId = this.data.post.user_id; //获取 user_id
    if (userId) {
      wx.navigateTo({
        url: '/pages/forum/personal_info/personal_info?user_id=' + userId
      });
    } else {
      console.error('用户ID未找到');
    }
  },
  getUserInfo(userId) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://43.143.205.76:8000/user/get_info',
        data: { user_id: userId },
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data.nickname);  // 返回昵称
          } else {
            reject('无法获取用户信息');
          }
        },
        fail: (err) => {
          reject('请求失败: ' + err);
        }
      });
    });
  },
  
});

function extractCommentContent(rawContent) {
  const match = rawContent.match(/\('([^']*)',\)/);
  return match ? match[1] : rawContent;
}
