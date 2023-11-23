interface Post {
  id: number;
  title: string;
  description: string;
  image: string;
}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    posts: [] as Post[] // 初始化帖子列表为空数组
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.fetchPosts();
  },

  /**
   * 获取帖子列表
   * 这里使用模拟数据来展示如何填充帖子列表
   * 在实际应用中，您可能需要从服务器获取数据
   */
  fetchPosts() {
    const postsData: Post[] = [
      {
        id: 1,
        title: "帖子标题 1",
        description: "这是帖子 1 的简短描述",
        image: "/images/resource.png" // 假设的图片路径
      },
      {
        id: 2,
        title: "帖子标题 2",
        description: "这是帖子 2 的简短描述",
        image: "/images/resource.png" // 假设的图片路径
      },
      // ...您可以添加更多帖子
    ];

    this.setData({ posts: postsData });
  },

  /**
   * 点击帖子卡片时触发的函数
   * 导航到帖子详情页面
   */
  navigateToPostDetail(event: WechatMiniprogram.BaseEvent) {
    const postId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/forum/post-detail/post-detail?id=${postId}`
    });
  },

  // 其他生命周期函数根据需要添加
});
