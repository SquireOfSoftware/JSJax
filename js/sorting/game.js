/**
 * Created by JarvisWalker on 14/12/16.
 */
var webApp = angular.module("webApp");

webApp.controller("gameCtrl", function($scope, $log, deckService) {
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

    $scope.init = function() {
        $scope.gameOver = false;
        deckService.initialiseDeck();
        setupTable();
        setupSuits();
    };

    function setupTable() {
        $scope.cards.current = deckService.drawCard();
        $scope.cards.next = deckService.drawCard();
    }

    function setupSuits() {
        var suits = [];
        for(var x = 0; x < 4; x++) {
            suits.push({
                suit: getSuit(x),
                symbol: getSuitSymbol(x),
                points: 0,
                cards: []
            });
        }
        suits = shuffleSuits(suits);
        $scope.pile = {
            top: suits[0],
            left: suits[1],
            right: suits[2],
            bottom: suits[3]
        };
        $log.debug($scope.pile);
    }

    function shuffleSuits (suitArray) {
        for(var x = suitArray.length - 1; x > 0; x--) {
            var position = Math.round(Math.random() * x, 0);
            var temp = suitArray[position];
            suitArray[position] = suitArray[x];
            suitArray[x] = temp;
        }
        return suitArray;
    }

    function getSuit(number) {
        switch(number) {
            case 0: return "C";
            case 1: return "D";
            case 2: return "H";
            case 3: return "S";
            default: return " ";
        }
    }

    function getSuitSymbol(number) {
        switch(number) {
            case 0: return "Club";
            case 1: return "Diamond";
            case 2: return "Heart";
            case 3: return "Spade";
            default: return " ";
        }
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
    }

    function addCard(pile) {
        var currentCard = $scope.cards.current;
        if (currentCard !== null) {
            pile.cards.push(currentCard);
            if (pile.suit === currentCard.suit) {
                pile.points++;
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
    }
});

webApp.filter("unsafe", function($sce) {
    return function(value) {
        return $sce.trustAsHtml(value);
    };
});