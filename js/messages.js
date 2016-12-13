/**
 * Created by JarvisWalker on 14/12/16.
 */

angular.module("webApp")
.controller("messageCtrl", function($scope, $log) {
    $scope.errorMessage = {
        title: "",
        messages: [],
        buttonText: ""
    };

    $scope.successMessage = {
        title: "",
        messages: [],
        buttonText: ""
    };

    $scope.loadingMessage = {
        title: "Loading",
        messages: []
    };

    $scope.$on('addErrorMessage', function(message) {
        $scope.errorMessage.messages.push(message);
    });

    $scope.$on('clearErrorMessage', function(message) {
        $scope.errorMessage.messages = [];
    });

    $scope.$on('addSuccessMessage', function(message) {
        $scope.successMessage.messages.push(message);
    });

    $scope.$on('clearSuccessMessage', function(message) {
        $scope.successMessage.messages = [];
    });

    $scope.$on('showErrorMessage', function() {
        jQuery(".loading").hide();
        jQuery(".errors").show();
    });

    $scope.$on('hideErrorMessage', function() {
        jQuery(".errors").hide();
    });

    $scope.$on('showSuccessMessage', function() {
        jQuery(".loading").hide();
        jQuery(".success").show();
    });

    $scope.$on('hideSuccessMessage', function() {
        jQuery(".success").hide();
    });

    $scope.$on('toggleLoadingScreen', function() {
        jQuery(".loading").toggle();
    });
});