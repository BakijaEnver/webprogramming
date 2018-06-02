function DashboardController($scope, $rootScope, $http){
    console.log("Hello from dashboard controller");

    var config = {headers:  {
      'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
      'Accept': 'application/json;odata=verbose',
      "JWT" : localStorage.getItem('user')
      }
    };

    var init = function(){
      console.log($rootScope);

      get_data();
      //get_countries_php();
    }

    var get_data = function (){
      $http.get('/data', config).then(function(response){
        $scope.info = response.data;
      }),function(response){
        alert(response.status);
      }
    };

   

    
    init();

  }
