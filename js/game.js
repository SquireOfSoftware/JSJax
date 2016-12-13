/**
 * Created by JarvisWalker on 12/12/16.
 */

angular.module("webApp")
    .controller("gameCtrl", function($log, $scope, deckService, aiService) {

    $scope.players = [];
    var states = {
        IDLE: 0,
        BUST: 1,
        HOLD: 2
    };
    $scope.playerId = 0;
    $scope.cardsLeft = 52;

    $scope.init = function() {
        // draw first hand

        deckService.initialiseDeck();
        setupAIPlayers(4);
        $scope.cardsLeft = deckService.cardsLeft();
    };

    function setupAIPlayers(number) {
        $scope.players = [];

        for(var x = 0; x < number; x++) {
            var startingHand = deckService.drawInitialHand();
            $log.debug(startingHand);
            var player = {
                id: x,
                difficulty: Math.round(Math.random() * number, 0),
                hand: startingHand.hand,
                state: states.IDLE,
                points: startingHand.points
            };

            $scope.players.push(player);
        }
        playerId = Math.round(Math.random() * number, 0);
        $log.debug($scope.players);
        $log.debug("Player ID is: ", playerId);
    }

    $scope.draw = function() {
        //var someoneBusted = false;
        drawRound();
        $scope.cardsLeft = deckService.cardsLeft();
    };

    function drawRound() {
        $scope.players.forEach(function(player) {
            if (!deckService.hasNextCard()) {
                $log.error("No cards left");
            }
            else if (player.state === states.IDLE) {
                var card = deckService.drawCard();
                player.hand.push(card);
                player.points += card.numericValue;
                $log.debug(player.state);
                if (isBust(player.hand)) {
                    player.state = states.BUST;
                    $log.error(player.id + " has busted!");
                }
            }
        });
    }

    function isBust(hand) {
        // calculate max value
        // calculate min value
        var value = 0;
        var aces = 0;
        hand.forEach(function(card) {
            value += card.numericValue;
            if (card.numericValue === 11) // there should only be one card who is 11
                aces++;
        });
        if (value > 21 && aces > 0) {
            value -= aces * 10;
        }
        return value > 21;
    }
});