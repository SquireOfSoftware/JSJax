/**
 * Created by JarvisWalker on 13/12/16.
 */

angular.module("webApp")
.service("playerService", function($log) {
    this.doesPlayerHold = function (player) {
        var willHold = true; // hold is true, draw is false

        // get hand value
        var points = 21 - player.points;

        // get risk
        var risk = Math.round((player.risk * Math.random()), 0);

        //$log.debug("id", player.id, "risk:", risk);
        if (risk === 1 && points > 4)
            willHold = false;

        return willHold;
    }
});