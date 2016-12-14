/**
 * Created by JarvisWalker on 14/12/16.
 */
var webApp = angular.module("webApp");

webApp.controller("gameCtrl", function($scope, $log, deckService, suitService) {
    $scope.cards = {
        current: {},
        next: {}
    };

    var pastCards = [];

    $scope.pile = {
        top: {},
        left: {},
        right: {},
        bottom: {}
    };

    $scope.gameOver = false;
    var scoreboard = jQuery("#scoreboard");

    $scope.score = {
        startTime: Date.now(),
        lastResponse: 0,
        averageResponse: 0,
        pointsGained: 0,
        totalPoints: 0,
        totalResponse: 0,
        sumResponses: 0
    };

    $scope.init = function() {
        scoreboard.hide();
        $scope.gameOver = false;
        deckService.initialiseDeck();
        setupTable();
        setupSuits();
        setupScore();
        scoreboard.show();
    };

    function setupTable() {
        $scope.cards.current = deckService.drawCard();
        $scope.cards.next = deckService.drawCard();
    }

    function setupSuits() {
        var suits = suitService.setupSuits();
        $scope.pile = {
            top: suits[0],
            left: suits[1],
            right: suits[2],
            bottom: suits[3]
        };
    }

    function setupScore() {
        $scope.score = {
            startTime: Date.now(),
            lastResponse: 0,
            averageResponse: 0,
            pointsGained: 0,
            totalPoints: 0,
            totalResponse: 0,
            sumResponses: 0
        };
    }

    function getNextCard() {
        pastCards.push($scope.cards.current);
        $scope.cards.current = $scope.cards.next;
        $scope.cards.next = deckService.drawCard();
    }

    $scope.pressedKey = function(event) {
        if (!$scope.gameOver)
            processKeyPress(event.keyCode);
    };

    function processKeyPress(keyCode) {
        $log.debug(event.keyCode);
        switch(event.keyCode) {
            case 37: // left
                addCard($scope.pile.left);
                break;
            case 38: // up
                addCard($scope.pile.top);
                break;
            case 39: // right
                addCard($scope.pile.right);
                break;
            case 40: // down
                addCard($scope.pile.bottom);
                break;
            default:
        }
        recordScore();
    }

    function addCard(pile) {
        var currentCard = $scope.cards.current;
        if (currentCard !== null) {
            pile.cards.push(currentCard);
            if (pile.suit === currentCard.suit) {
                pile.points++;
                $scope.score.pointsGained++;
            }
        }
        if (deckService.hasNextCard())
            getNextCard();
        else if ($scope.cards.current !== null) { // no cards left
            pastCards.push($scope.cards.current);
            $scope.cards.current = $scope.cards.next;
            $scope.cards.next = null;
        }
        if($scope.cards.current === null){
            $scope.gameOver = true;
            $log.error("Game over");
        }
        $scope.score.totalPoints++;
    }

    function recordScore() {
        $scope.score.lastResponse = Date.now() - $scope.score.startTime;
        $scope.score.startTime = Date.now();
        $scope.score.totalResponse++;
        $scope.score.sumResponses += $scope.score.lastResponse;
        $scope.score.averageResponse = Math.round($scope.score.sumResponses / $scope.score.totalResponse, 1);
    }
});