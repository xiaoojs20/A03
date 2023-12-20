// pages/forum/post-detail/post-detail.js
Page({
  data: {
    post: {}, // 帖子数据
    isLiked: false, // 初始未点赞状态
    comments: [] // 评论数据，可根据需要从后端获取
  },

  onLoad(options) {
    if (options.id) {
      this.loadPostDetail(options.id);
    }
  },

  loadPostDetail(postId) {
    const that = this;
    wx.request({
      url: 'http://localhost:8000/post/get_post_by_postid/', // 后端接口地址
      data: { post_id: postId },
      success: (res) => {
        if (res.statusCode === 200 && res.data && res.data.msg === 'get_post_by_postid ok') {
          that.setData({ post: res.data.post_info });
        } else {
          console.error('获取帖子详情失败:', res);
        }
      },
      fail: (err) => {
        console.error('请求帖子详情失败', err);
      }
    });
  },

  toggleLike() {
    this.setData({
      isLiked: !this.data.isLiked
    });
    // 这里可以添加发送点赞状态到服务器的代码
  },

  onShareAppMessage() {
    const post = this.data.post;
    return {
      title: post.title, 
      path: `/pages/forum/post-detail/post-detail?id=${post.post_id}`
    };
  },

  // 其他函数...
});
