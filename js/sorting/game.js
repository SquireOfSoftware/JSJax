/**
 * Created by JarvisWalker on 14/12/16.
 */
angular.module("webApp")
.controller("gameCtrl", function($scope, $log, deckService) {
    $scope.init = function() {
        deckService.initialiseDeck();

    }
});