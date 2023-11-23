interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
}

Page({
  data: {
    post: {} as Post // 使用 Post 接口
  },

  onLoad(options) {
    if (options.id) {
      this.loadPostDetail(options.id);
    }
  },

  loadPostDetail(postId: string) {
    // 模拟从后端获取数据
    // 在实际应用中，这里应该是一个异步请求
    const postDetail: Post = {
      id: parseInt(postId, 10),
      title: "示例帖子标题",
      description: "这里是帖子的详细描述...",
      image: "/1/resource.jpg"
    };
    this.setData({ post: postDetail });
  },

  onShareAppMessage() {
    const post = this.data.post;
    return {
      title: post.title, // TypeScript 现在知道 post 有一个 title 属性
      path: `/pages/forum/post-detail/post-detail?id=${post.id}`
    };
  }
});
