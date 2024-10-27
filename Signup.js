<!DOCTYPE html>
<html lang="en" ng-app="signupApp">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signup Page</title>
  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet">
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f8f9fa;
    }
    .signup-container {
      padding: 20px;
      width: 300px;
      border: 1px solid #ccc;
      border-radius: 8px;
      background-color: white;
    }
    .spinner-border {
      width: 24px;
      height: 24px;
    }
  </style>
</head>
<body ng-controller="SignupController">

  <div class="signup-container">
    <h4>Sign Up</h4>
    
    <div class="form-group">
      <label for="username">Username</label>
      <input type="text" class="form-control" id="username" ng-model="username" placeholder="Enter username">
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input type="password" class="form-control" id="password" ng-model="password" placeholder="Enter password">
    </div>

    <p class="text-danger" ng-if="error">{{ error }}</p>

    <button class="btn btn-primary btn-block" ng-click="handleSignup()" ng-disabled="loading">
      <span ng-if="loading" class="spinner-border spinner-border-sm"></span>
      <span ng-if="!loading">Sign Up</span>
    </button>
  </div>

  <!-- AngularJS Libraries -->
  <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.8.2/angular.min.js"></script>

  <script>
    // AngularJS App and Controller
    var app = angular.module('signupApp', []);

    app.controller('SignupController', function($scope, $http, $window) {
      $scope.username = "";
      $scope.password = "";
      $scope.loading = false;
      $scope.error = "";

      $scope.handleSignup = function() {
        if ($scope.username && $scope.password) {
          $scope.loading = true;
          $scope.error = "";

          $http.post('http://localhost:5000/api/auth/signup', {
            username: $scope.username,
            password: $scope.password
          }).then(function(response) {
            if (response.data.success) {
              alert('Signup successful! Welcome, ' + $scope.username + '.');
              $window.location.href = '/dashboard'; // Redirect to dashboard
            } else {
              $scope.error = response.data.message;
            }
          }).catch(function(error) {
            if (error.data) {
              // Error response from the server
              $scope.error = error.data.message || 'Signup failed. Please try again.';
            } else {
              // Network or other errors
              $scope.error = 'Error: ' + (error.message || 'No response from server. Please check your connection.');
            }
          }).finally(function() {
            $scope.loading = false;
          });
        } else {
          $scope.error = 'Please enter both username and password.';
        }
      };
    });
  </script>
</body>
</html>
