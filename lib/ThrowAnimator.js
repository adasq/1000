/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var throwAnimator = function(container) {

    var tableElem = container, space = 80,
            screen = {width: tableElem.width(), height: tableElem.height()},
    cardSize = {width: 250, height: 350},
    centerPosition = {top: ((screen.height / 2) - (cardSize.height / 2)) - 20, left: ((screen.width / 2) - (cardSize.width / 2))};
    centerPosition.top += tableElem.offset().top;
    centerPosition.left += tableElem.offset().left;

    var playersPosition = {};
    playersPosition.top = {top: (tableElem.offset().top - cardSize.height), left: (tableElem.offset().left + screen.width / 2 - cardSize.width / 2)};
    playersPosition.bottom = {top: (tableElem.offset().top + screen.height), left: (tableElem.offset().left + screen.width / 2 - cardSize.width / 2)};
    playersPosition.left = {top: (tableElem.offset().top + screen.height / 2 - cardSize.height / 2), left: (tableElem.offset().left - cardSize.width - space)};
    playersPosition.right = {top: (tableElem.offset().top + (screen.height / 2) - (cardSize.height / 2)), left: (tableElem.offset().left + screen.width + cardSize.width / 2)};


    var getRandom = function(a, b) {
        return Math.floor(Math.random() * b) + a;
    };
    var getPositionByElem = function(elem) {
        var position = {};
        if (elem.hasClass("top")) {
            position = {top: centerPosition.top - space, left: centerPosition.left};
        } else if (elem.hasClass("right")) {
            position = {top: centerPosition.top, left: centerPosition.left + space};
        } else if (elem.hasClass("bottom")) {
            position = {top: centerPosition.top + space, left: centerPosition.left};
        } else {//left
            position = {top: centerPosition.top, left: centerPosition.left - space};
        }
        return position;
    };


    return {
        playersLoc: playersPosition,
        speed: 800,
        zIndex: 0,
        cards: [],
        throwCard: function(elem, callback) {

            elem.addClass("on-table");
            this.cards.push(elem);
            elem.css('z-index', ++this.zIndex).animate(getPositionByElem(elem), this.speed, function() {
                callback();
            });
        },
        addPrickup: function(elems) {


            _.each(elems, function(cardElem, i) { 
                var pos = _.clone(centerPosition);
                pos.left+=i*150;
                 pos.top+=i*50;
                cardElem.removeClass("mini").addClass("hidden-card real prikup on-table").css(pos);
                $("#table").append(cardElem);

            });


        },
        removeFromTable: function(target, callback) {
            var elems = $(".on-table"), position;
            switch (target) {
                case  PlayerPossition.TOP:
                    position = this.playersLoc.top;
                    break;
                case  PlayerPossition.RIGHT:
                    position = this.playersLoc.right;
                    break;
                case  PlayerPossition.BOTTOM:
                    position = this.playersLoc.bottom;
                    break;
                case  PlayerPossition.LEFT:
                    position = this.playersLoc.left;
                    break;
            }
            ;
            var that = this;

            setTimeout(function() {
                $.when(elems.animate(position, this.speed)).then(function() {
                    elems.removeClass("on-table");
                    that.cards = [];
                    callback();
                });
            }, 1000);

            ;
        }
    };

};//throwAnimation