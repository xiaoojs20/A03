Page({

  // 页面的初始数据
  data: {
    posts: [] // 初始化帖子列表为空数组
  },

  // 生命周期函数--监听页面加载
  onLoad() {
    this.fetchPosts();
  },

  navigateToPersonalInfo: function() {
    const userId = "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q";
    wx.navigateTo({
      url: '/pages/forum/personal_info/personal_info?user_id=' + userId
    });
  },

  // 获取帖子列表
  fetchPosts() {
    const postIds = ['1', '2', '3', '4']; // 示例ID列表
  
    const postPromises = postIds.map(postId => 
      new Promise((resolve, reject) => {
        wx.request({
          url: 'http://43.143.205.76:8000/post/get_post_by_postid',
          method: 'GET',
          data: { post_id: postId },
          success: (postRes) => {
            if (postRes.statusCode === 200 && postRes.data && postRes.data.msg === 'get_post_by_postid ok') {
              const postInfo = postRes.data.post_info;
              // 获取作者昵称
              wx.request({
                url: 'http://43.143.205.76:8000/user/get_info',
                data: { user_id: postInfo.user_id },
                success: (userInfoRes) => {
                  const nickname = userInfoRes.data && userInfoRes.data.nickname ? userInfoRes.data.nickname : '未知作者';
                  const post = {
                    ...postInfo,
                    author: nickname // 添加作者昵称
                  };
                  resolve(post);
                },
                fail: (err) => {
                  console.error(`Request failed for user info of post ${postId}`, err);
                  resolve(null);
                }
              });
            } else {
              console.error(`Error fetching post ${postId}`, postRes);
              resolve(null);
            }
          },
          fail: (err) => {
            console.error(`Request failed for post ${postId}`, err);
            resolve(null);
          }
        });
      })
    );
  
    Promise.all(postPromises).then(fetchedPosts => {
      const validPosts = fetchedPosts.filter(post => post != null);
      this.setData({ posts: validPosts });
    });
  },
  

  // 点击帖子卡片时触发的函数，导航到帖子详情页面
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
    });
  }

  // 其他生命周期函数根据需要添加
})
