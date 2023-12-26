Page({

  // 页面的初始数据
  data: {
    posts: [] // 初始化帖子列表为空数组
  },
  
  adjustScrollViewHeight: function() {
    const that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollViewHeight: res.windowHeight // 设置 scrollViewHeight 数据绑定
        });
      }
    });
  },
  // 生命周期函数--监听页面加载
  onLoad() {
    this.fetchPostIds();
    this.adjustScrollViewHeight();
  },
  
  onShow() {
    this.fetchPostIds();
  },

  navigateToPersonalInfo: function() {
    const userId = "o-Hbd6bbDxfCqNpz5xsTgMLKDR3Q";
    wx.navigateTo({
      url: '/pages/forum/personal_info/personal_info?user_id=' + userId
    });
  },

  // 获取帖子列表

fetchPostIds(n = 10) {  // 默认获取10个帖子
  wx.request({
    url: 'http://43.143.205.76:8000/post/get_n_latest_posts/',
    method: 'GET',
    data: { n: n }, // 请求最新的n个帖子的ID
    success: (res) => {
      if (res.statusCode === 200 && res.data && res.data.msg === 'get_latest_posts ok') {
        const postIds = res.data.posts.map(post => post.post_id);

        // 打印获取的帖子ID及其类型
        console.log('Fetched post IDs:', postIds);
        console.log('Type of postIds:', typeof postIds);
        console.log('Is postIds an array:', Array.isArray(postIds));

        this.fetchPosts(postIds); // 使用获取的帖子ID调用fetchPosts
      } else {
        console.error('Error fetching post IDs', res);
      }
    },
    fail: (err) => {
      console.error('Request failed for fetching post IDs', err);
    }
  });
},

// Existing function for fetching posts
fetchPosts(postIds) {
  const that = this;
  const postPromises = postIds.map(postId => 
    new Promise((resolve, reject) => {
      wx.request({
        url: 'http://43.143.205.76:8000/post/get_post_by_postid',
        method: 'GET',
        data: { post_id: postId },
        success: (postRes) => {
          console.log('API Response:', postRes); // 打印整个响应对象
          if (postRes.statusCode === 200 && postRes.data && postRes.data.msg === 'get_post_by_postid ok') {
            const postInfo = postRes.data.post_info;
            wx.request({
              url: 'http://43.143.205.76:8000/user/get_info',
              data: { user_id: postInfo.user_id },
              success: (userInfoRes) => {
                if (userInfoRes.statusCode === 200 && userInfoRes.data) {
                  const nickname = userInfoRes.data.nickname || '未知作者';
                  resolve({ ...postInfo, author: nickname });
                } else {
                  console.error(`Request failed for user info of post ${postId}`);
                  resolve({ ...postInfo, author: '未知作者' });
                }
              },
              fail: (err) => {
                console.error(`Request failed for user info of post ${postId}`, err);
                resolve({ ...postInfo, author: '未知作者' });
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
    const validPosts = fetchedPosts.filter(post => post !== null);
    that.setData({ posts: validPosts });
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
