/**
 * Created by JarvisWalker on 12/12/16.
 */

angular.module("webApp")
    .controller("gameCtrl", function($log, $scope, deckService, playerService) {

    $scope.players = [];

    var states = {
        IDLE: "IDLE",
        BUST: "BUST",
        HOLD: "HOLD",
        WON: "WON"
    };
    $scope.playerId = 0;
    $scope.cardsLeft = 52;
    $scope.gameOver = false;

    var loadingScreen = jQuery(".loading");

    $scope.init = function() {
        // draw first hand

        deckService.initialiseDeck();
        setupAIPlayers(4);
        $scope.cardsLeft = deckService.cardsLeft();
        jQuery(".table").toggle();
        jQuery(".gameOver").toggle();
    };

    function setupAIPlayers(number) {
        $scope.players = [];

        for(var x = 0; x < number; x++) {
            var startingHand = deckService.drawInitialHand();
            var player = {
                id: x,
                risk: Math.random(),
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
        loadingScreen.toggle();
        drawRound();
        loadingScreen.toggle();
    };

    function drawRound() {
        if (!$scope.gameOver) {
            $scope.players.forEach(function (player) {

                if (player.state === states.IDLE &&
                    player.id !== $scope.playerId &&
                    playerService.doesPlayerHold(player)) {
                    player.state = states.HOLD;
                }

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
        var idle = 0;
        var highestPointsSoFar = 0;
        var highestPointPlayers = [];
        players.forEach(function(player) {
            //$log.debug(player.id, player.hand);
            var points = verifyHand(player.hand);
            player.points = points;
            if (player.state === states.IDLE)
                idle++;

            if (player.state === states.BUST) {

            }
            else if (points == 21) {
                $log.info(player.id + " has won! with " + points, player.hand);
                player.state = states.WON;
                $scope.gameOver = true;
            }
            else if (highestPointsSoFar < player.points) {
                highestPointsSoFar = player.points;
                highestPointPlayers.push(player.id)
            }
        });
        if (!$scope.gameOver && idle <= 1) {
            $log.debug(highestPointPlayers);
            highestPointPlayers.forEach(function(id) {
                $scope.players[id].state = states.WON;
            });
            $scope.gameOver = true;
        }

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

            loadingScreen.toggle();
            if ($scope.players[$scope.playerId].state === states.IDLE)
                $scope.players[$scope.playerId].state = states.HOLD;
            $log.debug("Entering hold");
            do {
                drawRound();
                // game should continue without player input
                //$log.debug("Round");
            } while (!$scope.gameOver && verifyValidPlayers($scope.players));
            loadingScreen.toggle();
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