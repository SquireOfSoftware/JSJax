/**
 * Created by JarvisWalker on 14/12/16.
 */

angular.module("webApp")
.controller("messageCtrl",['$scope', function($log, $scope) {
    $scope.errors = {
        title: "",
        messages: [],
        buttonText: ""
    };

    $scope.successes = {
        title: "",
        messages: [],
        buttonText: ""
    };

    $scope.loading = {
        title: "Loading",
        messages: []
    };

    $scope.$on('addErrorMessage', function(message) {
        $scope.errors.messages.push(message);
    });

    $scope.addSuccessMessage = function(message) {
        $scope.successes.messages.push(message);
    };

    $scope.showErrorMessage = function() {
        jQuery(".loading").hide();
        jQuery(".errors").show();
    };

    $scope.hideErrorMessage = function() {
        jQuery(".errors").hide();
    };

    $scope.showSuccessMessage = function() {
        jQuery(".loading").hide();
        jQuery(".success").show();
    };

    $scope.hideSuccessMessage = function() {
        jQuery(".success").hide();
    };

    $scope.toggleLoadingScreen = function() {
        jQuery(".loading").toggle();
    };
}]);