app.controller('sidebarCtrl', function($scope, $location, $http){

    $scope.check_login = function(){
        if(localStorage.getItem('user')){
            return true;
        }
        return false;
    }

    $scope.check_reg = function(){
        if(localStorage.getItem('reg')){
            return true;
        }
        return false;
    }

    $scope.login = function(credentials){
        $http.post('/login', credentials).then(function(response){
            localStorage.setItem('user',response.data.token);
            $location.path("/");
        }),function(error){
            console.log(error);
        }
    }

    $scope.register = function(credentials){
        $http.post('/register', credentials).then(function(response){
           localStorage.setItem('reg', response.data.token);
        }),function(error){
            console.log(error);
        }
    }

    $scope.logout = function(){
        localStorage.clear();
        localStorage.setItem('reg', "random");
    }

    $scope.goLog = function () {
        localStorage.clear();
        localStorage.setItem('reg', "random");
        $location.path("/login");
      };

    $scope.goReg = function () {
        localStorage.clear();
        $location.path("/register");
    };

    $scope.getUsername = function() {

    }

    $scope.getClass = function (path) {
        if (path == '/dashboard' && $location.path() == '/') return 'active';
        return ($location.path() === path) ? 'active' : '';
    },

    $scope.openNavigationDrawer = function(){
        if ($scope.mobileNavigationOpen == 'nav-open'){
            $scope.mobileNavigationOpen = '';
        }else{
            $scope.mobileNavigationOpen = 'nav-open';
        }
        
    }
    $scope.menuItemClicked = function(){
        $scope.mobileNavigationOpen = '';
    }

});