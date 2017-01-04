// Initialize Firebase
var config = {
  apiKey: "AIzaSyBPKFraRS0wqYj9_Yp2b1sYMuapjJH98ew",
  authDomain: "mystickyapp.firebaseapp.com",
  databaseURL: "https://mystickyapp.firebaseio.com",
  storageBucket: "mystickyapp.appspot.com",
  messagingSenderId: "1037022995801"
};
firebase.initializeApp(config);


let app = angular.module('stickOnApp', ['ngMaterial', 'firebase', 'ngSanitize']);

app.config(($mdThemingProvider) => {
$mdThemingProvider.theme('default')
  .primaryPalette('light-blue')
  .accentPalette('pink');
})

app.controller('appCtrl', ['$scope', '$firebaseArray', '$mdSidenav', '$mdDialog', ($scope, $firebaseArray, $mdSidenav, $mdDialog) => {

  // firebase ADD, DELETE, EDIT sticky functions
    let database = firebase.database().ref("/stickies").orderByChild('timestamp');
    $scope.stickies = $firebaseArray(database);

    addSticky = (title, text) => {
        $scope.stickies.$add({
        title: title || " ",
        text: text || " ",
        timestamp: 0 - Date.now()
        });
    };

    $scope.deleteSticky = (sticky) => {
      let index = $scope.stickies.indexOf(sticky);
      $scope.stickies.$remove(index).then((database) => {
        database.key === index.$id;
      })
    }

    editSticky = (sticky) => {
      let index = $scope.stickies.indexOf(sticky);

      $scope.stickies.$save(index).then((database) => {
        database.key == $scope.stickies[index].$id;
      })
    }

    $scope.toggleSidenav = (menuId) => {
      $mdSidenav(menuId).toggle();
    }

    $scope.status = ' ';
    $scope.customFullscreen = false;

    AddStickyDiagCtrl = ($scope, $mdDialog) => {
      $scope.hide = () => {
        $mdDialog.hide();
      };

      $scope.cancel = () => {
        $mdDialog.cancel();
      };

      $scope.sticky = (title, text) => {
        addSticky(title, text);
        $mdDialog.hide(title, text);
      };
    }

    $scope.showAddSticky = (ev) => {
       $mdDialog.show({
         controller: AddStickyDiagCtrl,
         templateUrl: 'add-sticky-dialog.tmpl.html',
         parent: angular.element(document.body),
         targetEvent: ev,
         clickOutsideToClose:true,
         fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
       })
       .then((sticky) => {
          $scope.status = 'sticky has been added';
       }, () => {
         $scope.status = 'You cancelled the dialog.';
       });
    };

    $scope.showEditSticky = (ev, sticky) => {
       $mdDialog.show({
         controller: EditStickyDiagCtrl,
         templateUrl: 'edit-sticky-dialog.tmpl.html',
         parent: angular.element(document.body),
         targetEvent: ev,
         clickOutsideToClose:true,
         fullscreen: $scope.customFullscreen, // Only for -xs, -sm breakpoints.
         locals: {
          sticky: sticky
         }
       })
       .then((sticky) => {
          $scope.status = 'sticky has been edited';
       }, () => {
         $scope.status = 'You cancelled the dialog.';
       });
    };

    EditStickyDiagCtrl = ($scope, $mdDialog, sticky) => {
      $scope.sticky = sticky
      
      $scope.hide = () => {
        $mdDialog.hide();
      };

      $scope.cancel = () => {
        $mdDialog.cancel();
      };

      $scope.updateSticky = () => {
        editSticky(sticky);
        $mdDialog.hide();
      };
    }
     
}]);

app.filter('formatText', () => {
 return (input) => {
  if(!input) return input;

  let output = input
      //replace new lines
      .replace(/(\r\n|\r|\n)/g, '<br/>')
      //replace tabs
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;')
  return output;
 } 
});
