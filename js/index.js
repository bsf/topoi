angular.module("Application", ["Application.Constants", "Application.Controllers", "Application.Directives", "Application.Filters", "Application.Resources", "Application.Services", "ngResource", "ui.bootstrap"])

    .config(["$httpProvider", function($httpProvider) {
        delete $httpProvider.defaults.headers.common["X-Requested-With"]
    }])

    .config(["$locationProvider", "$routeProvider", function($locationProvider, $routeProvider) {
        $routeProvider
            .when("/home", {controller: "HomeController", templateUrl: "html/home.html"})
            .when("/login", {controller: "LogInController", templateUrl: "html/login.html"})
            .when("/logout", {controller: "LogOutController", templateUrl: "html/logout.html"})
            .when("/resetpassword", {controller: "ResetPasswordController", templateUrl: "html/resetpassword.html"})
            .when("/signup", {controller: "SignUpController", templateUrl: "html/signup.html"})
            .otherwise({redirectTo: "/home"})
    }])

angular.module("Application.Constants", [])

    .constant("KinveyAppKey", "kid_ePnnV73luf")

    .constant("KinveyAppSecret", "a2lkX2VQbm5WNzNsdWY6MGY3YTFmNDliZDQzNDA3N2JhYzE4YjU2NDA2MTMzYWE=")

    .constant("KinveyBaseUrl", "https://baas.kinvey.com")

angular.module("Application.Controllers", [])

    .controller("AlertsController", ["$scope", "AlertsService", function($scope, AlertsService) {
        $scope.deleteAlert = function(index) {
            AlertsService.deleteAlert(index)
        }
        $scope.getAlerts = function() {
            return AlertsService.getAlerts()
        }
    }])

    .controller("HomeController", ["$scope", function($scope) {
    }])

    .controller("LogInController", ["$scope", "UserService", function($scope, UserService) {
        $scope.logIn = function() {
            UserService.logIn($scope.password, $scope.username)
        }
    }])

    .controller("LogOutController", ["$scope", "UserService", function($scope, UserService) {
        $scope.logOut = function() {
            UserService.logOut()
        }
    }])

    .controller("NavController", ["$scope", function($scope) {
    }])

    .controller("ResetPasswordController", ["$scope", "ResetPasswordService", function($scope, ResetPasswordService) {
        $scope.resetPassword = function() {
            ResetPasswordService.resetPassword($scope.username)
        }
    }])

    .controller("SignUpController", ["$scope", "UserService", function($scope, UserService) {
        $scope.signUp = function() {
            UserService.signUp($scope.email, $scope.password, $scope.username)
        }
    }])

angular.module("Application.Directives", [])

angular.module("Application.Filters", [])

angular.module("Application.Resources", [])

    .factory("ResetPasswordResource", ["$resource", "KinveyAppKey", "KinveyBaseUrl", function($resource, KinveyAppKey, KinveyBaseUrl) {
        return $resource(KinveyBaseUrl + "/rpc/" + KinveyAppKey + "/:username/user-password-reset-initiate", {}, {
            resetPassword: {method: "POST", params: {username: "@username"}}
        })
    }])

    .factory("UserResource", ["$resource", "KinveyAppKey", "KinveyBaseUrl", function($resource, KinveyAppKey, KinveyBaseUrl) {
        return $resource(KinveyBaseUrl + "/user/" + KinveyAppKey + "/:verb", {}, {
            logIn: {method: "POST", params: {verb: "login"}},
            logOut: {method: "POST", params: {verb: "_logout"}},
            signUp: {method: "POST", params: {verb: ""}}
        })
    }])

angular.module("Application.Services", [])

    .run(["AuthorizationHeaderService", function(AuthorizationHeaderService) {
        AuthorizationHeaderService.initialise()
    }])

    .factory("AlertsService", ["$rootScope", function($rootScope) {
        var AlertClass = Object.freeze({Error: "error", Info: "info", Success: "success", Warn: ""})
        var _alerts = []
        var insertAlert = function(alertClass, alertMessage) {
            _alerts.push({alertClass: alertClass, alertMessage: alertMessage})
        }
        var insertErrorAlert = function(alertMessage) {
            _alerts.push({alertClass: AlertClass.Error, alertMessage: alertMessage})
        }
        var insertInfoAlert = function(alertMessage) {
            _alerts.push({alertClass: AlertClass.Info, alertMessage: alertMessage})
        }
        var insertSuccessAlert = function(alertMessage) {
            _alerts.push({alertClass: AlertClass.Success, alertMessage: alertMessage})
        }
        var insertWarnAlert = function(alertMessage) {
            _alerts.push({alertClass: AlertClass.Warn, alertMessage: alertMessage})
        }
        $rootScope.$on("ResetPasswordService.resetPasswordError", function(event, data) {
            insertErrorAlert(data.alertMessage)
        })
        $rootScope.$on("ResetPasswordService.resetPasswordSuccess", function(event, data) {
            insertSuccessAlert(data.alertMessage)
        })
        $rootScope.$on("UserService.logInError", function(event, data) {
            insertErrorAlert(data.alertMessage)
        })
        $rootScope.$on("UserService.logInSuccess", function(event, data) {
            insertSuccessAlert(data.alertMessage)
        })
        $rootScope.$on("UserService.logOutError", function(event, data) {
            insertErrorAlert(data.alertMessage)
        })
        $rootScope.$on("UserService.logOutSuccess", function(event, data) {
            insertSuccessAlert(data.alertMessage)
        })
        $rootScope.$on("UserService.signUpError", function(event, data) {
            insertErrorAlert(data.alertMessage)
        })
        $rootScope.$on("UserService.signUpSuccess", function(event, data) {
            insertSuccessAlert(data.alertMessage)
        })
        return {
            deleteAlert: function(index) {
                _alerts.splice(index, 1)
            },
            getAlerts: function() {
                return _alerts
            }
        }
    }])

    .factory("AuthorizationHeaderService", ["$http", "$rootScope", "AuthorizationService", "KinveyAppSecret", function($http, $rootScope, AuthorizationService, KinveyAppSecret) {
        var setAuthorizationHeader = function(authorizationHeader) {
            $http.defaults.headers.common.Authorization = authorizationHeader
        }
        var setBasicAuthorizationHeader = function() {
            setAuthorizationHeader("Basic " + KinveyAppSecret)
        }
        var setKinveyAuthorizationHeader = function() {
            setAuthorizationHeader("Kinvey " + AuthorizationService.getAuthorization())
        }
        $rootScope.$on("UserService.logInSuccess", function(event, data) {
            setKinveyAuthorizationHeader()
        })
        $rootScope.$on("UserService.logOutSuccess", function(event, data) {
            setBasicAuthorizationHeader()
        })
        $rootScope.$on("UserService.signUpSuccess", function(event, data) {
            setKinveyAuthorizationHeader()
        })
        return {
            initialise: function() {
                setBasicAuthorizationHeader()
            }
        }
    }])

    .factory("AuthorizationService", ["$rootScope", function($rootScope) {
        var Authorization = Object.freeze({NoAuthorization: {}})
        var _authorization = Authorization.NoAuthorization
        $rootScope.$on("UserService.logInSuccess", function(event, data) {
            _authorization = data.authorization
        })
        $rootScope.$on("UserService.logOutSuccess", function(event, data) {
            _authorization = Authorization.NoAuthorization
        })
        $rootScope.$on("UserService.signUpSuccess", function(event, data) {
            _authorization = data.authorization
        })
        return {
            getAuthorization: function() {
                return _authorization
            },
            hasAuthorization: function() {
                return _authorization !== Authorization.NoAuthorization
            }
        }
    }])

    .factory("ResetPasswordService", ["$rootScope", "ResetPasswordResource", function($rootScope, ResetPasswordResource) {
        return {
            resetPassword: function(username) {
                var resetPasswordResource = ResetPasswordResource.resetPassword({}, {username: username}, function() {
                    $rootScope.$emit("ResetPasswordService.resetPasswordSuccess", {alertMessage: "An email has been sent to " + username + "!"})
                }, function(data) {
                    $rootScope.$emit("ResetPasswordService.resetPasswordError", {alertMessage: data.data.description})
                })
            }
        }
    }])

    .factory("UserService", ["$rootScope", "UserResource", function($rootScope, UserResource) {
        return {
            logIn: function(password, username) {
                var userResource = UserResource.logIn({}, {password: password, username: username}, function() {
                    $rootScope.$emit("UserService.logInSuccess", {alertMessage: "Welcome back to Topoi!", authorization: userResource._kmd.authtoken})
                }, function(data) {
                    $rootScope.$emit("UserService.logInError", {alertMessage: (data.status === 401) ? "Please choose a different username and/or password" : data.data.description})
                })
            },
            logOut: function() {
                var userResource = UserResource.logOut({}, {}, function() {
                    $rootScope.$emit("UserService.logOutSuccess", {alertMessage: "Thanks for visiting Topoi!"})
                }, function(data) {
                    $rootScope.$emit("UserService.logOutError", {alertMessage: data.data.description})
                })
            },
            signUp: function(email, password, username) {
                var userResource = UserResource.signUp({}, {email: email, password: password, username: username}, function() {
                    $rootScope.$emit("UserService.signUpSuccess", {alertMessage: "Welcome to Topoi!", authorization: userResource._kmd.authtoken})
                }, function(data) {
                    $rootScope.$emit("UserService.signUpError", {alertMessage: (data.status === 409) ? "Please choose a different username" : data.data.description})
                })
            }
        }
    }])