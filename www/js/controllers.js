angular.module('starter.controllers', [])

.factory('xmlParser', function () {
    var x2js = new X2JS();
    return {
        xml2json: function (args) {
            return angular.bind(x2js, x2js.xml2json, args)();
        },
        xml_str2json: function (args) {
            return angular.bind(x2js, x2js.xml_str2json, args)();
        },
        json2xml_str: function (args) {
            return angular.bind(x2js, x2js.json2xml_str, args)();
        }
    }
})


// Set or get settings
   .service('Bundeslandservice', function () {
      console.log("SearchValueService setup done");
      return {

         // get or set userdata
         setBundeslandid: function (bundeslandid) {
            window.localStorage['bundeslandid'] = bundeslandid;
            console.log("bundeslandid setted: " + bundeslandid);
         },
         setTouchID: function (touchid) {
            window.localStorage['touchid'] = touchid;
            console.log("touchid setted: " + touchid);
         },
         setLoginsync: function (loginsync) {
            window.localStorage['loginsync'] = loginsync;
            console.log("loginsync setted: " + loginsync);
         },
         setChangesync: function (changesync) {
            window.localStorage['changesync'] = changesync;
            console.log("changesync setted: " + changesync);
         },
         setUserPassword: function (userpassword) {
            window.localStorage['userpassword'] = userpassword;
            console.log("userpassword setted: " + userpassword);
         },
         getBundeslandid: function () {
            console.log("bundeslandid got: " + window.localStorage['bundeslandid']);
            return window.localStorage['bundeslandid'] + "";
         },
         getTouchID: function () {
            console.log("touchid got: " + window.localStorage['touchid']);
            return window.localStorage['touchid'] + "";
         },
         getUserName: function () {
            console.log("username got: " + window.localStorage['username']);
            return window.localStorage['username'] + "";
         },
         getLoginSync: function () {
            console.log("loginsync got: " + window.localStorage['loginsync']);
            return window.localStorage['loginsync'] + "";
         },
         getChangesync: function () {
            console.log("changesync got: " + window.localStorage['changesync']);
            return window.localStorage['changesync'] + "";
         }
      }
   })

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  // $scope.$on('$ionicView.enter', function(e) {
  // });

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('ctrlBundeslandauswahl', function($scope, $stateParams, Bundeslandservice, $state) {

$scope.showdetails = function(bundeslandid){
Bundeslandservice.setBundeslandid(bundeslandid);
$state.go("app.bundesland",{}, {});
}

})

.controller('ctrlBundesland', function($http, $scope, xmlParser,$ionicLoading,$ionicPopup,$timeout, Bundeslandservice, $state) {

$scope.convertToDate = function (stringDate){
  var dateOut = new Date(stringDate);
  dateOut.setDate(dateOut.getDate() + 1);
  return dateOut;
};


$scope.deimudderseigesicht = function(){
if(ionic.Platform.isIOS()){

 $http.get("http://www.ascomp.de/extlink/index.php?progname=LMWarn&lang=DE&targeturl=LMWarn_iOS"  ,{timeout:10000});
 window.open('itms-apps://itunes.apple.com/de/app/passta-der-passwortmanager/id993099038','_system', 'location=no');

}
else
{
  $http.get("http://www.ascomp.de/extlink/index.php?progname=LMWarn&lang=DE&targeturl=LMWarn_Android"  ,{timeout:10000});
 window.open('market://details?id=de.mobile.ascomp.passta','_system', 'location=no');

}


};
var bundeslandid  = Bundeslandservice.getBundeslandid();


$scope.openlink = function(url) {
    window.open(url,'_system', 'location=no');
  };

        $ionicLoading.show();

var timer = $timeout(
            function () {

                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Keine Verbindung"
                });
            },
            5500
        );

        angular.element(document).ready(function () {
            $ionicLoading.show();

            // Parse xml and decrypt
            $http.get(
                'http://www.lebensmittelwarnung.de/bvl-lmw-de/app/feed/' + bundeslandid, {
                    transformResponse: function (data) {
                        // convert the data to JSON and provide
                        // it to the success function below

                        var json = xmlParser.xml_str2json(data.toString());
                        $scope.data = json;
                        var log = [];

                        angular.forEach(json.rss.channel.item, function(value, key) {
                            //alert(key + ': ' + String(value.description.__cdata));
                            var cdata = String(value.description.__cdata);
                            var indexofwidth=cdata.indexOf('" width');
                            var indexofimg=cdata.indexOf('img src="')+9;
                            var indexofb=cdata.indexOf('<b');

                            var pubDate = String(value.pubDate);





                            if(indexofb>0){
                            //alert(cdata.slice(indexofimg,indexofwidth));
                            (value.description=cdata.slice(indexofimg,indexofwidth));
                            //alert($scope.data.rss.channel.item.description);
                            }else{
                            value.description="./img/noimg.png";
                            };
                            //alert(value.description.slice(indexof));
                        }, log);

                        // var title = json.Row.ArtNr;
                        $ionicLoading.hide();
                        $timeout.cancel(timer);
                        console.log("Json Setted!");
                    }
                }
            );
        });


})

.controller("FeedController", function($http, $scope, xmlParser,$ionicLoading,$ionicPopup,$timeout) {


$scope.deimudderseigesicht = function(){
if(ionic.Platform.isIOS()){

 $http.get("http://www.ascomp.de/extlink/index.php?progname=LMWarn&lang=DE&targeturl=LMWarn_iOS"  ,{timeout:10000});
 window.open('itms-apps://itunes.apple.com/de/app/passta-der-passwortmanager/id993099038','_system', 'location=no');

}
else
{
  $http.get("http://www.ascomp.de/extlink/index.php?progname=LMWarn&lang=DE&targeturl=LMWarn_Android"  ,{timeout:10000});
 window.open('market://details?id=de.mobile.ascomp.passta','_system', 'location=no');

}


};

$scope.openlink = function(url) {
    window.open(url,'_system', 'location=no');
  };


$scope.convertToDate = function (stringDate){
  var dateOut = new Date(stringDate);
  dateOut.setDate(dateOut.getDate() + 1);
  return dateOut;
};

        $ionicLoading.show();

var timer = $timeout(
            function () {

                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Keine Verbindung"
                });
            },
            5500
        );

        angular.element(document).ready(function () {
            $ionicLoading.show();

            // Parse xml and decrypt
            $http.get(
                'http://www.lebensmittelwarnung.de/bvl-lmw-de/app/feed/alle_warnungen.rss', {
                    transformResponse: function (data) {
                        // convert the data to JSON and provide
                        // it to the success function below

                        var json = xmlParser.xml_str2json(data.toString());
                        $scope.data = json;
                        var log = [];

                        angular.forEach(json.rss.channel.item, function(value, key) {
                            //alert(key + ': ' + String(value.description.__cdata));
                            var cdata = String(value.description.__cdata);
                            var indexofwidth=cdata.indexOf('" width');
                            var indexofimg=cdata.indexOf('img src="')+9;
                            var indexofb=cdata.indexOf('<b');

                            if(indexofb>0){
                            //alert(cdata.slice(indexofimg,indexofwidth));
                            (value.description=cdata.slice(indexofimg,indexofwidth));
                            //alert($scope.data.rss.channel.item.description);
                            }else{
                            value.description="./img/noimg.png";
                            };
                            //alert(value.description.slice(indexof));
                        }, log);

                        // var title = json.Row.ArtNr;
                        $ionicLoading.hide();
                        $timeout.cancel(timer);
                        console.log("Json Setted!");
                    }
                }
            );
        });


})

.controller("ctrlNeue", function($http, $scope, xmlParser,$ionicLoading,$ionicPopup,$timeout) {

$scope.openlink = function(url) {
    window.open(url,'_system', 'location=no');
  };

        $ionicLoading.show();

var timer = $timeout(
            function () {

                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Keine Verbindung"
                });
            },
            5500
        );

        angular.element(document).ready(function () {
            $ionicLoading.show();

            // Parse xml and decrypt
            $http.get(
                'http://www.lebensmittelwarnung.de/bvl-lmw-de/app/feed/neueste_warnungen.rss', {
                    transformResponse: function (data) {
                        // convert the data to JSON and provide
                        // it to the success function below

                        var json = xmlParser.xml_str2json(data.toString());
                        $scope.data = json;
                        var log = [];

                        angular.forEach(json.rss.channel.item, function(value, key) {
                            //alert(key + ': ' + String(value.description.__cdata));
                            var cdata = String(value.description.__cdata);
                            var indexofwidth=cdata.indexOf('" width');
                            var indexofimg=cdata.indexOf('img src="')+9;
                            var indexofb=cdata.indexOf('<b');

                            if(indexofb>0){
                            //alert(cdata.slice(indexofimg,indexofwidth));
                            (value.description=cdata.slice(indexofimg,indexofwidth));
                            //alert($scope.data.rss.channel.item.description);
                            }else{
                            value.description="./img/noimg.png";
                            };
                            //alert(value.description.slice(indexof));
                        }, log);

                        // var title = json.Row.ArtNr;
                        $ionicLoading.hide();
                        $timeout.cancel(timer);
                        console.log("Json Setted!");
                    }
                }
            );
        });


});
