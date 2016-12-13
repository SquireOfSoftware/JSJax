/**
 * Created by JarvisWalker on 12/12/16.
 */

angular.module("webApp")
    .controller("gameCtrl", function($log, $scope, deckService, playerService) {

    $scope.players = [];

    var states = {
        IDLE: 0,
        BUST: 1,
        HOLD: 2,
        WON: 3
    };
    $scope.playerId = 0;
    $scope.cardsLeft = 52;
    $scope.gameOver = false;

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
            var player = {
                id: x,
                difficulty: Math.round(Math.random() * number, 0),
                hand: startingHand.hand,
                state: states.IDLE,
                points: startingHand.points
            };

            $scope.players.push(player);
        }
        $scope.playerId = Math.floor(Math.random() * number, 0);
        $log.debug($scope.players);
        $log.debug("Player ID is: ", $scope.playerId);
    }

    $scope.draw = function() {
        drawRound();
    };

    function drawRound() {
        if (!$scope.gameOver) {
            $scope.players.forEach(function (player) {
                if (!deckService.hasNextCard()) {
                    $log.error("No cards left");
                }
                else if (player.state === states.IDLE) {
                    var card = deckService.drawCard();
                    player.hand.push(card);
                    player.points = verifyHand(player.hand);
                    if (player.points > 21) {
                        player.state = states.BUST;
                        $log.error(player.id + " has busted!");
                    }
                }
            });
            $scope.cardsLeft = deckService.cardsLeft();
            verifyWinners($scope.players);
        }
        else
            $log.error("Game is over.");
    }

    function verifyWinners(players) {
        players.forEach(function(player) {
            //$log.debug(player.id, player.hand);
            var points = verifyHand(player.hand);
            if (player.state === states.BUST) {

            }
            else if (points == 21) {
                $log.info(player.id + " has won! with " + points, player.hand);
                player.state = states.WON;
                $scope.gameOver = true;
            }
        });
    }

    function verifyHand(hand) {
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
        return value;
    }

    // conditions
        // someone has exactly 21 at the end of the turn
        // subcondition - suit, colours and smallest hand matter
        // someone has gone over 21, highest person at the end wins
        // same sub conditions apply


    $scope.hold = function() {
        if (!$scope.gameOver) {
            if ($scope.players[$scope.playerId].state === states.IDLE)
                $scope.players[$scope.playerId].state = states.HOLD;
            $log.debug("Entering hold");
            do {
                drawRound();
                // game should continue without player input
                //$log.debug("Round");
            } while (verifyValidPlayers($scope.players));

        }
    };

    function verifyValidPlayers(players) {
        var validPlayers = 0;
        players.forEach(function(player) {
            //$log.debug(player.id, player.state, player.hand.length, states.IDLE);
            if (player.state === states.IDLE)
                validPlayers++;
            // atleast one person is active
        });
        $log.info(validPlayers + " players are left");
        if(validPlayers === 0) {
            $scope.gameOver = true;
            $log.error("Game over");
        }
        return validPlayers > 0;
    }

    });