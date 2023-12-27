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
      },
      fail: (err) => {
        console.error("Error getting system info:", err);
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
        console.log("Requesting post data for ID:", postId);
        wx.request({
          url: 'http://43.143.205.76:8000/post/get_post_by_postid',
          method: 'GET',
          data: { post_id: postId },
          success: (postRes) => {
            console.log("Received response for post:", postRes);
            if (postRes.statusCode === 200 && postRes.data && postRes.data.msg === 'get_post_by_postid ok') {
              const postInfo = postRes.data.post_info;
              console.log("Fetching user info for user ID:", postInfo.user_id);
              wx.request({
                url: 'http://43.143.205.76:8000/user/get_info',
                data: { user_id: postInfo.user_id },
                success: (userInfoRes) => {
                  const nickname = userInfoRes.data.nickname || '未知作者';
                  console.log("User info received:", nickname);
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
      console.log("Requesting latest post IDs");
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
              console.log("Posts updated in data");
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
    console.log("Loading post images for posts:", posts);
  
    return new Promise((resolve, reject) => {
      const postImagePromises = posts.map(post => {
        return new Promise((resolve, reject) => {
          console.log("Requesting image for post ID:", post.post_id);
          wx.request({
            url: 'http://43.143.205.76:8000/post/get_image/',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: { post_id: post.post_id },
            responseType: 'arraybuffer',
            success: (res) => {
              console.log("Image response received for post:", post.post_id, res);
              if (res.statusCode === 200 && res.data) {
                const base64Image = wx.arrayBufferToBase64(res.data);
                const imageUrl = 'data:image/jpeg;base64,' + base64Image;
                post.imageUrl = imageUrl; // 设置帖子的 imageUrl 属性
                resolve(post);
              } else {
                console.error('Failed to get image for post:', post.post_id, res);
                post.imageUrl = ''; // 若获取图片失败，则设置为空字符串
                resolve(post);
              }
            },
            fail: (err) => {
              console.error('Failed to request image for post', post.post_id, err);
              post.imageUrl = ''; // 请求失败同样设置为空字符串
              resolve(post);
            }
          });
        });
      });
  
      Promise.all(postImagePromises).then(updatedPosts => {
        console.log("All post images loaded:", updatedPosts);
        resolve(updatedPosts); // 返回处理好的帖子数组
      }).catch(error => {
        console.error("Error loading post images:", error);
        reject(error); // 错误处理
      });
    });
  },
  

  fetchTopPosts() {
    console.log("Fetching top posts");
    this.fetchPostIds(100).then(posts => {
      console.log("Top posts fetched, filtering for top posts:");
      const topPosts = posts.filter(post => post.is_top);
      console.log("Filtered top posts:", topPosts);
      this.loadPostImages(topPosts).then(loadedTopPosts => {
        this.setData({ topPosts: loadedTopPosts });
        console.log("Top posts updated in data with images");
      }).catch(error => {
        console.error("Error loading images for top posts:", error);
      });
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
