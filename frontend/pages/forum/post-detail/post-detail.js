// pages/forum/post-detail/post-detail.js
// pages/forum/post-detail/post-detail.js
Page({
  data: {
    post: {}, // 帖子数据
    isLiked: false, // 初始未点赞状态
    comments: [ // 模拟评论数据
      { "id": "1", "author": "用户A", "content": "非常有趣的帖子！"},
      { "id": "2", "author": "用户B", "content": "同意楼上的观点。"},
      { "id": "3", "author": "用户C", "content": "很有启发性，谢谢分享。"}
    ] 
  },

  onLoad(options) {
    if(options.id) {
      this.loadPostDetail(options.id);
    }
  },

  loadPostDetail(postId) {
    // 模拟从后端获取数据
    const postDetail = {
      id: parseInt(postId, 10),
      title: "示例帖子标题",
      description: "这里是帖子的详细描述...",
      image: "/images/froum_data/" + postId + "/resource.png" // 确保图片路径正确
    };
    this.setData({ post: postDetail });
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
      path: `/pages/forum/post-detail/post-detail?id=${post.id}`
    };
  },

  submitComment() {
    // 提交评论逻辑
  }
});
