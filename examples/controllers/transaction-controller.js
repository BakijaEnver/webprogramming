function TransactionController($scope, $http, $location, $mdDialog, $mdToast, $timeout){
    console.log("Hello from transaction controller");

    var config = {headers:  {
        'Authorization': 'Basic d2VudHdvcnRobWFuOkNoYW5nZV9tZQ==',
        'Accept': 'application/json;odata=verbose',
        "JWT" : localStorage.getItem('user')
        }
      };

    var init = function(){
        
      get_transactions();

      }


      $scope.addTransaction = function(trans){
        $http.post('/addtrans', trans).then(function(response){
            $scope.message_added = "Congratulations, you successfuly added the transaction.";
            $timeout(function(){ 
              $scope.message_added = "";
            },3000);
        }),function(error){
            console.log(error);
        }
    }

    

    var get_transactions = function (){
      $http.get('/gettransactions', config).then(function(response){
        $scope.transaction = response.data;
      }),function(response){
        alert(response.status);
      }
    };

    $scope.removetransaction = function(id){
      $http.delete('/deletetrans/'+id, config).then(function(response){
        get_transactions();
      }, function(error){
        console.log(error);
      });
    }

      init();


}

