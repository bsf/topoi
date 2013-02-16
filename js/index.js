angular.module("Application", ["Application.Constants", "Application.Controllers", "Application.Directives", "Application.Filters", "Application.Resources", "Application.Services", "ngResource", "ui.bootstrap"])

    .config(["$httpProvider", function($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"];
    }])

    .config(["$locationProvider", "$routeProvider", function($locationProvider, $routeProvider) {
        $routeProvider
            .when("/home", {controller: "HomeController", templateUrl: "html/home.html"})
            .when("/login", {controller: "LogInController", templateUrl: "html/login.html"})
            .when("/logout", {controller: "LogOutController", templateUrl: "html/logout.html"})
            .when("/resetpassword", {controller: "ResetPasswordController", templateUrl: "html/resetpassword.html"})
            .when("/signup", {controller: "SignUpController", templateUrl: "html/signup.html"})
            .otherwise({redirectTo: "/home"});
    }]);

angular.module("Application.Constants", []);

angular.module("Application.Controllers", [])

    .controller("HomeController", ["$scope", function($scope) {
    }])

    .controller("LogInController", ["$scope", "UserService", function($scope, UserService) {
        $scope.logIn = function() {
            console.log("LogInController login");
            UserService.logIn();
        }
    }])

    .controller("LogOutController", ["$scope", "UserService", function($scope, UserService) {
        $scope.logOut = function() {
            console.log("LogOutController logOut");
            UserService.logOut();
        }
    }])

    .controller("NavController", ["$scope", function($scope) {
    }])

    .controller("ResetPasswordController", ["$scope", "ResetPasswordService", function($scope, ResetPasswordService) {
        $scope.resetPassword = function() {
            console.log("ResetPasswordController resetPassword");
            ResetPasswordService.resetPassword();
        }
    }])

    .controller("SignUpController", ["$scope", "UserService", function($scope, UserService) {
        $scope.signUp = function() {
            console.log("SignUpController signUp");
            UserService.signUp();
        }
    }]);

angular.module("Application.Directives", []);

angular.module("Application.Filters", []);

angular.module("Application.Resources", []);

angular.module("Application.Services", [])

    .factory("ResetPasswordService", ["$rootScope", function($rootScope) {
        return {
            resetPassword: function() {
                console.log("ResetPasswordService resetPassword");
            }
        }
    }])

    .factory("UserService", ["$rootScope", function($rootScope) {
        return {
            logIn: function() {
                console.log("UserService logIn");
            },
            logOut: function() {
                console.log("UserService logOut");
            },
            signUp: function() {
                console.log("UserService signUp");
            }
        }
    }]);
