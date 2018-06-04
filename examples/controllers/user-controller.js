function UserController($scope, $http, $location, $mdDialog, $mdToast, $timeout){
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
          $scope.message_success = "Congratulations, you successfuly updated the user info.";
          $timeout(function(){ 
            $scope.message_success = "";
          },3000);
        }),function(error){
            console.log(error);
        }
      }

      $scope.delete_user = function(id){
        $http.delete('/delete/'+id, config).then(function(response){
          
          localStorage.clear();
        }, function(error){
          console.log(error);
        });
      }

      $scope.find_user = function(search){
        var family="";
        var interests="";
        var location="";
        var age="";
        family=search.family;
        interests=search.interests;
        location=search.location;
        age=search.age;
        $http.get('/users/'+family+'/'+interests+'/'+location+'/'+age).then(function(response){
           $scope.userssearch = response.data;
        }, function(error){
          console.log(error);
        });
      }

      $scope.find_provider = function(search){
        var family="";
        var interests="";
        var location="";
        var age="";
        family=search.family;
        interests=search.interests;
        location=search.location;
        age=search.age;
        $http.get('/providers/'+family+'/'+interests+'/'+location+'/'+age).then(function(response){
           $scope.providerssearch = response.data;
        }, function(error){
          console.log(error);
        });
      }


      $scope.showPrompt = function(ev, user) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
          .title('Senda a message to ' + user.username)
          .textContent('Explain what ad you need ' + user.username + ' for.')
          .placeholder('explanation')
          .ariaLabel('explanation')
          .initialValue('Hello ' + user.username +'!')
          .targetEvent(ev)
          .required(true)
          .ok('Okay!')
          .cancel('Choose another user');
    
        $mdDialog.show(confirm).then(function(result) {
          $http.post('/connect_user', { 'user' : user.username , 'message' : result} ).then(function(response){
           
         }),function(error){
             console.log(error);
         }
        });

      };
    

      $scope.showPromptProvider = function(ev, provider) {
        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.prompt()
          .title('Senda a message to ' + provider.username)
          .textContent('Explain what ad you need ' + provider.username + ' for.')
          .placeholder('explanation')
          .ariaLabel('explanation')
          .initialValue('Hello ' + provider.username +'!')
          .targetEvent(ev)
          .required(true)
          .ok('Okay!')
          .cancel('Choose another provider');
    
        $mdDialog.show(confirm).then(function(result) {
          $http.post('/connect_provider', { 'advertiser' : provider.username , 'message' : result} ).then(function(response){
            
         }),function(error){
             console.log(error);
         }
        });

      };


      init();


}

