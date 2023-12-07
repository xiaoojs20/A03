Page({

  /**
   * 页面的初始数据
   */
  data: {
    posts: [] // 初始化帖子列表为空数组
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
   * 在实际应用中,您可能需要从服务器获取数据
  */
 fetchPosts() {
  // 假设的帖子文本数据，以JSON格式直接定义
  const postData = [
    {
      id: "00000001",
      title: "帖子标题1",
      content: "这里是帖子内容1...",
      likes: 10, // 点赞数
      author: "用户A", // 发帖用户
      shares: 5, // 分享数
      // 其他所需字段...
    },
    {
      id: "00000002",
      title: "帖子标题2",
      content: "这里是帖子内容2...",
      likes: 20,
      author: "用户B",
      shares: 3,
      // 其他所需字段...
    },
    // 更多帖子...
  ];

  // 保存帖子列表
  let posts = [];

  // 获取 forum_data 目录下的帖子文件夹
  const folders = wx.getFileSystemManager().readdirSync('/images/froum_data');

  // 按 id 排序文件夹，并取前 5 个（或postData的长度，取较小值）
  folders.sort((a, b) => parseInt(b) - parseInt(a));
  const topFolders = folders.slice(0, Math.min(5, postData.length));

  // 遍历文件夹和postData
  topFolders.forEach((folderId, index) => {
    // 找到匹配的帖子数据
    const postInfo = postData.find(post => post.id === folderId);

    // 如果找到匹配的帖子数据
    if (postInfo) {
      // 构造帖子完整信息
      const post = {
        ...postInfo,
        image: `/images/froum_data/${folderId}/resource.png` // 图像路径
      };

      // 添加到帖子列表
      posts.push(post);
    }
  });

  // 更新帖子数据
  this.setData({ posts });
},

  /**
   * 点击帖子卡片时触发的函数
   * 导航到帖子详情页面
  */
  navigateToPostDetail(event) {
    const postId = event.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: `/pages/forum/post-detail/post-detail?id=${postId}`
    });
  },

  // 添加点击事件
  navigateToCreatePost() {
  wx.navigateTo({
    url: '/pages/forum/create-post/create-post' 
  })
}

  // 其他生命周期函数根据需要添加
})