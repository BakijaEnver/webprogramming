function UserController($scope, $http){
    console.log("Hello from user controller");

    var config = {headers:  {
        'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
        'Accept': 'application/json;odata=verbose',
        "JWT" : localStorage.getItem('user')
        }
      };

    var init = function(){
        get_users();

      }

      var get_users = function (){
        $http.get('/user', config).then(function(response){
          $scope.users = response.data;
        }),function(response){
          alert(response.status);
        }
      };

      $scope.update = function(credentials){
        $http.put('/update', credentials).then(function(response){

        }),function(error){
            console.log(error);
        }
    }

      init();


}

