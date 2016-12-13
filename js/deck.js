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

    // alternatives
    // preconfigure the deck - pros, fast to get next card, cons, predictable
    // - slight issue with prediction and storing
    // - could creating everything then jumble
    // - dynamically add cards - but has same issue as drawing on the fly, duplicates
    // draw on the fly - pros, unpredictable, cons, need to address duplicates

    // could try fisher-yates - create the deck then randomly pick position to swap things in


    this.drawInitialHand = function() {
        var hand = [];
        for(var x = 0; x < 2; x++) {
            hand.push(this.drawCard());
        }
        return hand;
    };

    this.initialiseDeck = function() {
        for (var suit = 0; suit < 4; suit++) {
            for (var value = 1; value <= 13; value++) {
                var card = {
                    suit: getSuit(suit),
                    symbolicValue: getSymbolicValue(value),
                    numericValue: getNumericValue(value),
                    //picture: ""
                };

                if (value === 1)
                    card.numericValue = 11;

                //card.picture = "Cards/" + card.suit + card.symbolicValue + ".png";

                deck.push(card);
            }
        }
        // shuffle
        deck = shuffleDeck(deck);
        //$log.debug(testDeck(deck));
    };

    function shuffleDeck (deckArray) {
        //$log.info(deckArray);
        for(var x = deckArray.length - 1; x > 0; x--) {
            var position = Math.round(Math.random() * x, 0);
            var temp = deckArray[position];
            deckArray[position] = deckArray[x];
            deckArray[x] = temp;
            //$log.debug(position);
        }
        //$log.info(deckArray);
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

    function testDeck(deck) {
        var suits = {
            hearts: 0,
            clubs: 0,
            diamonds: 0,
            spades: 0,
            what: 0
        };
        deck.forEach(function(card) {
            switch(card.suit) {
                case "C": suits.clubs++; break;
                case "D": suits.diamonds++; break;
                case "H": suits.hearts++; break;
                case "S": suits.spades++; break;
                default: suits.what++;
            }
        });
        $log.debug(suits);
    }
});