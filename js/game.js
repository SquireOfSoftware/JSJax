/**
 * Created by JarvisWalker on 12/12/16.
 */

angular.module("webApp")
    .controller("gameCtrl", function($log, $scope, deckService) {

    $scope.players = [];
    var states = {
        IDLE: 0,
        BUST: 1,
        HOLD: 2
    };
    $scope.playerId = 0;

    $scope.init = function() {
        // draw first hand

        deckService.initialiseDeck();
        setupAIPlayers(4);
    };

    function setupAIPlayers(number) {
        $scope.players = [];

        for(var x = 0; x < number; x++) {
            var player = {
                id: x,
                hand: deckService.drawInitialHand(),
                state: states.IDLE
            };

            $scope.players.push(player);
        }
        playerId = Math.round(Math.random() * number, 0);
        $log.debug($scope.players);
        $log.debug("Player ID is: ", playerId);
    }

    $scope.draw = function() {
        var someoneBusted = $scope.players.forEach(function(player) {
            var someoneBusted = false;
            if (player.state === states.IDLE) {
                player.hand.push(deckService.drawCard());
                if (isBust(player.hand)) {
                    player.state = states.BUST;
                    someoneBusted = true;
                }
            }
            return someoneBusted;
        });
        //.then(function(someoneBusted) {
            if (someoneBusted) {
                var busted = [];
                $scope.players.forEach(function(player) {
                    if (player.state === states.BUST)
                        busted.push(player.id);
                });
                $log.debug("players who busted: ", busted);
            }
        //}); // figure out what to do after
    };

    function isBust(hand) {
        // calculate max value
        // calculate min value
        var value = 0;
        var aces = 0;
        hand.forEach(function(card) {
            value += card.value;
            if (card.value === 11) // there should only be one card who is 11
                aces++;
        });
        if (value > 21 && aces > 0) {
            value -= aces * 10;
        }
        return value > 21;
    }
});