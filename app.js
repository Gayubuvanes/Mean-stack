var app = angular.module('socialMediaApp', []);

app.controller('MainController', function($scope, $http) {
  // Current user info
  $scope.user = { id: 'user123', name: 'Current User' };

  $scope.trends = [
    { category: "#BRANDS", title: "New Brand Has Release" },
    { category: "#FASHION", title: "Citayem Harajuku" },
    { category: "#TUMBLER", title: "New Product" },
    { category: "#ART NFT", title: "New NFT" }
  ];

  $scope.posts = [
    {
      id: 'post1',
      user: 'Shadow',
      content: 'This is my new Exploration, what do you think?',
      image: 'i1.jpg',
      avatar: 'h1.jpg',
      likes: [],
      comments: []
    },
    {
      id: 'post2',
      user: 'Zakky',
      content: 'Wow amazing work!',
      image: 'i2.jpg',
      avatar: 'h2.png',
      likes: [],
      comments: []
    }
  ];

  $scope.users = [
    { name: 'Terizla', avatar: 'a1.jpeg' },
    { name: 'Harley', avatar: 'a2.jpg' },
    { name: 'Leomord', avatar: 'a3.jpg' },
    { name: 'Ruby', avatar: 'a4.jpg' }
  ];

  $scope.activeContact = $scope.users[0]; // Default to the first user
  $scope.newComment = {}; // Object to hold new comments

  // Function to like a post
  $scope.likePost = function(postId) {
    const post = $scope.posts.find(p => p.id === postId);
    if (!post.likes.find(like => like.userId === $scope.user.id)) {
      post.likes.push({ userId: $scope.user.id, username: $scope.user.name });
      // Make a call to the backend (you may need to adjust the URL)
      $http.post('/api/like', { userId: $scope.user.id, postId: postId })
        .then(function(response) {
          console.log('Like saved:', response.data);
        });
    }
  };

  // Function to submit a comment
  $scope.commentPost = function(postId) {
    const commentText = $scope.newComment[postId];
    if (commentText) {
      const commentData = {
        postId: postId,
        userId: $scope.user.id,
        username: $scope.user.name,
        text: commentText
      };
      // Call the backend API to save the comment
      $http.post('http://localhost:5000/api/posts/comment', commentData)
        .then(function(response) {
          if (response.data.success) {
            const post = $scope.posts.find(p => p.id === postId);
            if (post) {
              post.comments.push({
                username: $scope.user.name,
                text: commentText
              });
            }
            // Clear the input field
            $scope.newComment[postId] = '';
          } else {
            console.error('Error adding comment:', response.data.message);
          }
        })
        .catch(function(error) {
          console.error('Error:', error);
        });
    }
  };

  // Function to select a contact
  $scope.selectContact = function(contact) {
    $scope.activeContact = contact;
  };

  // Sending a new message
  $scope.newMessage = '';
  $scope.sendMessage = function() {
    if ($scope.newMessage.trim() !== '') {
      $scope.activeContact.messages.push({ text: $scope.newMessage, sender: 'me' });
      $scope.newMessage = ''; // Clear input field
    }
  };
});
