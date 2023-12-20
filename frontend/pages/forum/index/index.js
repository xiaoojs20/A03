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
  // 声明并初始化帖子ID列表
  const postIds = ['1', '2']; // 示例ID列表，根据需要修改

  // 创建一个promise数组，用于并行获取所有帖子数据
  const postPromises = postIds.map(postId => 
    new Promise((resolve, reject) => {
      wx.request({
        url: 'http://43.143.205.76:8000/post/get_post_by_postid',
        data: { post_id: postId },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.post_info) {
            const postInfo = res.data.post_info;
            const post = {
              ...postInfo,
              image: `/images/forum_data/${postId}/resource.png`
            };
            resolve(post);
          } else {
            console.error(`Error fetching post ${postId}`, res);
            resolve(null); // 解析为 null，而不是拒绝 Promise
          }
        },
        fail: (err) => {
          console.error(`Request failed for post ${postId}`, err);
          resolve(null); // 同样解析为 null
        }
      });
    })
  );

  Promise.all(postPromises)
    .then(fetchedPosts => {
      const validPosts = fetchedPosts.filter(post => post != null);
      this.setData({ posts: validPosts });
    });
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