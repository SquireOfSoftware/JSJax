/**
 * Created by JarvisWalker on 13/12/16.
 */

angular.module("webApp").service("deckService", function($log){
    var drawnCards = [];
    var deck = [];
    var cardCounter = 0;

    this.drawCard = function() {
        var card = deck[cardCounter++];
        drawnCards.push(card);
        return card;
    };

    this.hasNextCard = function() {
        return cardCounter < deck.length;
    };

    this.cardsLeft = function() {
        return deck.length - cardCounter;
    };

    // alternatives
    // preconfigure the deck - pros, fast to get next card, cons, predictable
    // - slight issue with prediction and storing
    // - could creating everything then jumble
    // - dynamically add cards - but has same issue as drawing on the fly, duplicates
    // draw on the fly - pros, unpredictable, cons, need to address duplicates

    // could try fisher-yates - create the deck then randomly pick position to swap things in

    this.drawInitialHand = function() {
        var hand = [];
        var points = 0;
        for(var x = 0; x < 2; x++) {
            var card = this.drawCard();
            hand.push(card);
            points += card.numericValue;
            if (card.symbolicValue === "A" &&
                points > 21)
                points -= 10;
        }
        return {hand: hand, points: points};
    };

    this.initialiseDeck = function() {
        for (var suit = 0; suit < 4; suit++) {
            for (var value = 1; value <= 13; value++) {
                var card = {
                    suit: getSuit(suit),
                    symbolicValue: getSymbolicValue(value),
                    numericValue: getNumericValue(value)
                };

                if (value === 1)
                    card.numericValue = 11;

                deck.push(card);
            }
        }
        // shuffle
        deck = shuffleDeck(deck);
    };

    function shuffleDeck (deckArray) {
        for(var x = deckArray.length - 1; x > 0; x--) {
            var position = Math.round(Math.random() * x, 0);
            var temp = deckArray[position];
            deckArray[position] = deckArray[x];
            deckArray[x] = temp;
        }
        return deckArray;
    };

    function getSuit(number) {
        switch(number) {
            case 0: return "C";
            case 1: return "D";
            case 2: return "H";
            case 3: return "S";
            default: return " ";
        }
    }

    function getNumericValue(number) {
        switch(number) {
            case 11:
            case 12:
            case 13:
            case 14: return 10;
            default: return number;
        }
    }

    function getSymbolicValue(number) {
        switch(number) {
            case 1: return "A";
            case 11: return "J";
            case 12: return "Q";
            case 13: return "K";
            default: return number.toString();
        }
    }
});