/**
 * Created by JarvisWalker on 13/12/16.
 */

var webApp = angular.module("webApp", []);

webApp.config(function($logProvider) {
    $logProvider.debugEnabled(false);
});