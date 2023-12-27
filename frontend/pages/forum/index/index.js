Page({
  // 页面的初始数据
  data: {
    posts: [], // 初始化帖子列表为空数组
    topPosts: [], // 初始化置顶帖子列表为空数组
    postImages: {}, // 存储帖子图片的对象
    isLoading: false, // 控制加载动画的显示
    scrollViewHeight: 0 // 滚动视图的高度
  },
  
  adjustScrollViewHeight: function() {
    const that = this;
    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          scrollViewHeight: res.windowHeight
        });
        console.log("ScrollView height set:", res.windowHeight);
      }
    });
  },

  onLoad() {
    console.log("Page onLoad triggered");
    this.fetchTopPosts();
    this.fetchPostIds();
    this.adjustScrollViewHeight();
  },
  
  onShow() {
    console.log("Page onShow triggered");
    this.fetchTopPosts();
  },

  fetchPosts(postIds) {
    console.log("Fetching posts, IDs:", postIds);
    return new Promise((resolve, reject) => {
      const postPromises = postIds.map(postId => new Promise((resolve, reject) => {
        wx.request({
          url: 'http://43.143.205.76:8000/post/get_post_by_postid',
          method: 'GET',
          data: { post_id: postId },
          success: (postRes) => {
            console.log("Received response for post:", postRes);
            if (postRes.statusCode === 200 && postRes.data && postRes.data.msg === 'get_post_by_postid ok') {
              const postInfo = postRes.data.post_info;
              wx.request({
                url: 'http://43.143.205.76:8000/user/get_info',
                data: { user_id: postInfo.user_id },
                success: (userInfoRes) => {
                  const nickname = userInfoRes.data.nickname || '未知作者';
                  resolve({ ...postInfo, author: nickname });
                },
                fail: (err) => {
                  console.error('Request failed for user info:', err);
                  resolve({ ...postInfo, author: '未知作者' });
                }
              });
            } else {
              console.error(`Error fetching post ${postId}:`, postRes);
              resolve(null);
            }
          },
          fail: (err) => {
            console.error(`Request failed for post ${postId}:`, err);
            resolve(null);
          }
        });
      }));

      Promise.all(postPromises).then(fetchedPosts => {
        const validPosts = fetchedPosts.filter(post => post !== null);
        console.log("Fetched posts:", validPosts);
        this.setData({ posts: validPosts });
        resolve(validPosts);
      }).catch(error => {
        console.error('Error in fetching posts:', error);
        reject(error);
      });
    });
  },

  fetchPostIds(n = 10) {
    console.log("Fetching post IDs, count:", n);
    this.setData({ isLoading: true }); // 开始加载数据
    return new Promise((resolve, reject) => {
      wx.request({
        url: 'http://43.143.205.76:8000/post/get_n_latest_posts/',
        method: 'GET',
        data: { n: n },
        success: (res) => {
          console.log("Received response for post IDs:", res);
          if (res.statusCode === 200 && res.data && res.data.msg === 'get_latest_posts ok') {
            const postIds = res.data.posts.map(post => post.post_id);
            console.log("Post IDs fetched:", postIds);
            this.fetchPosts(postIds).then(posts => {
              this.setData({ isLoading: false }); // 加载完成
              resolve(posts);
            }).catch(error => {
              console.error('Error in fetchPosts:', error);
              this.setData({ isLoading: false }); // 加载完成
              reject(error);
            });
          } else {
            console.error('Error fetching post IDs:', res);
            this.setData({ isLoading: false }); // 加载完成
            reject('Error fetching post IDs');
          }
        },
        fail: (err) => {
          console.error('Request failed for post IDs:', err);
          this.setData({ isLoading: false }); // 加载完成
          reject(err);
        }
      });
    });
  },

  loadPostImages(posts) {
    const that = this;
    const postImagePromises = posts.map(post => new Promise((resolve, reject) => {
      console.log("加载帖子图片: ", post.post_id);
      wx.request({
        url: 'http://43.143.205.76:8000/post/get_image/',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: { post_id: post.post_id },
        responseType: 'arraybuffer',
        success: (res) => {
          console.log("帖子图片响应: ", res);
          if (res.statusCode === 200 && res.data) {
            const base64Image = wx.arrayBufferToBase64(res.data);
            const imageUrl = 'data:image/jpeg;base64,' + base64Image;
            post.imageUrl = imageUrl; // 设置帖子的 imageUrl 属性
            resolve(post);
          } else {
            console.error('获取帖子图片失败:', res);
            post.imageUrl = '';
            resolve(post);
          }
        },
        fail: (err) => {
          console.error('请求帖子图片失败', err);
          post.imageUrl = '';
          resolve(post);
        }
      });
    }));

    Promise.all(postImagePromises).then(updatedPosts => {
      console.log("所有帖子图片加载完成:", updatedPosts);
      if (posts === that.data.topPosts) {
        that.setData({ topPosts: updatedPosts }); // 更新置顶帖子的数据
      } else {
        that.setData({ posts: updatedPosts }); // 更新普通帖子的数据
      }
    });
  },

  fetchTopPosts() {
    console.log("Fetching top posts");
    this.fetchPostIds(100).then(posts => {
      console.log("Top posts fetched, filtering for top posts:");
      const topPosts = posts.filter(post => post.is_top);
      console.log("Filtered top posts:", topPosts);
      this.setData({ topPosts });
    }).catch(error => {
      console.error("Error fetching top posts:", error);
    });
  },

  navigateToPostDetail(event) {
    const postId = event.currentTarget.dataset.id;
    console.log("Navigating to post detail for post ID:", postId);
    wx.navigateTo({
      url: `/pages/forum/post-detail/post-detail?id=${postId}`
    });
  },

  navigateToCreatePost() {
    console.log("Navigating to create post page");
    wx.navigateTo({
      url: '/pages/forum/create-post/create-post'
    });
  },

  onReachBottom() {
    console.log("Reached bottom of the page, fetching more posts");
    this.fetchPostIds(30); // 当页面滚动到底部时，获取更多帖子
  }
});
