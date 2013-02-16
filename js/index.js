angular.module("Application", ["Application.Controllers"])

    .config(["$locationProvider", "$routeProvider", function($locationProvider, $routeProvider) {
        $routeProvider
            .when("/home", {controller: "HomeController", templateUrl: "html/home.html"})
            .when("/login", {controller: "LogInController", templateUrl: "html/login.html"})
            .when("/logout", {controller: "LogOutController", templateUrl: "html/logout.html"})
            .when("/resetpassword", {controller: "ResetPasswordController", templateUrl: "html/resetpassword.html"})
            .when("/signup", {controller: "SignUpController", templateUrl: "html/signup.html"})
            .otherwise({redirectTo: "/home"});
    }]);

angular.module("Application.Controllers", [])

    .controller("HomeController", ["$scope", function($scope) {
    }])

    .controller("LogInController", ["$scope", function($scope) {
        $scope.logIn = function() {
            console.log("LogInController login");
        }
    }])

    .controller("LogOutController", ["$scope", function($scope) {
        $scope.logOut = function() {
            console.log("LogOutController logOut");
        }
    }])

    .controller("NavController", ["$scope", function($scope) {
    }])

    .controller("ResetPasswordController", ["$scope", function($scope) {
        $scope.resetPassword = function() {
            console.log("ResetPasswordController resetPassword");
        }
    }])

    .controller("SignUpController", ["$scope", function($scope) {
        $scope.signUp = function() {
            console.log("SignUpController signUp");
        }
    }]);