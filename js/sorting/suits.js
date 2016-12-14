/**
 * Created by JarvisWalker on 14/12/16.
 */
angular.module("webApp")
.service("suitService", function() {

    this.setupSuits = function() {
        var suits = [];
        for (var x = 0; x < 4; x++) {
            suits.push({
                suit: getSuit(x),
                symbol: getSuitSymbol(x),
                points: 0,
                cards: []
            });
        }
        return shuffleSuits(suits);
    };

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
});