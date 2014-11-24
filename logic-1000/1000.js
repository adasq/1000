/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


var App = App || {Models: {}, Views: {}, Collections: {}};

//=================================================
App.Models.Card = Backbone.Model.extend({
    default: {
        visible: true,
        mini: true,
        real: false
    },
    initialize: function() {
        this.show();
        this.updateReferences();
    },
    updateReferences: function() {
        this.cardObject = this.get("card");
        this.playerObject = this.get("player");
    },
    hide: function() {
        this.set("visible", false);
    },
    show: function() {
        this.set("visible", true);
    },
    getPlayer: function() {
        return this.get("player");
    },
    addCardToPlayer: function(targetPlayerModel){
            
           var targetPlayerObject = targetPlayerModel.get("player");
           
          var initPlayerModel =  this.get("player");
            var initPlayerObject = initPlayerModel.get("player");
            this.set("player", targetPlayerModel);
            
            initPlayerObject.removeCard(this.get("card"));
            targetPlayerObject.addCard(this.get("card"));
            
            initPlayerModel.cards.remove(this);
            targetPlayerModel.cards.add(this);
    },
    toJSON: function() {
        var obj = _.clone(this.attributes.card);
        obj.visible = this.get("visible");
        obj.real = this.get("real");
        obj.mini = this.get("mini");
        return obj;
    }
});
//=================================================
App.Views.Card = Backbone.View.extend({
    tagName: "li",
    template: _.template($("#card-template").html()),
    events: {
        "click": "throw"
    },
    throw: function() {
        var initPlayerModel = this.model.getPlayer();
        
        if (initPlayerModel.cards.hasLotsOfCards()) {
            //ma za duzo kart, musi czesc wydac:
            
            var targetPlayerModel = players.getPlayerWithoutFullCardSet();             
            this.model.addCardToPlayer(targetPlayerModel);
           
        } else {
            //ma komplet kart     
            var result = gameTable.currentRound.throwCard(this.model.get("card"));
            console.log(BattleState.getMessageByBattleState(result.type))
            if (result.error) {                 
                return -1;
            } else {
                initPlayerModel.removeCard(this.model);
            }
        }
    },
    initialize: function() {
        this.model.on('change', this.render, this);
        this.model.on('remove', this.remove, this);
    },
    remove: function() {
        this.$el.remove();
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});
//=================================================
App.Collections.Cards = Backbone.Collection.extend({
    model: App.Models.Card,
    initialize: function() {
    },
    hasLotsOfCards: function(){
        return (this.length > 8);
    },
    hasAllCards: function(){
         return (this.length === 7);
    }
});
//=================================================
App.Views.Cards = Backbone.View.extend({
    tagName: "ul",
    className: "cards",
    initialize: function() {
        this.collection.on('add', this.addCard, this);
        this.collection.on('reset', this.removeCards, this);
    },
    removeCards: function() {
        this.$el.empty();
    },
    render: function() {
        this.collection.forEach(this.addCard, this);
        return this;
    },
    addCard: function(card) {
        var view = new App.Views.Card({model: card});
        this.$el.append(view.render().el);
    }
});
//=================================================

App.Models.Player = Backbone.Model.extend({
    initialize: function() {
        this.cards = this.get("cards");
    },
    removeCard: function(card) {
        this.get("cards").remove(card);
        tableCollection.add(card);
    }
});


//=================================================
App.Collections.TableCards = Backbone.Collection.extend({
    model: App.Models.Card
});

App.Views.TableCards = Backbone.View.extend({
    tagName: "ul",
    className: "table-cards",
    animator: null,
    initialize: function() {
        this.collection.on("add", this.addCardOnTable, this);
        this.animator = throwAnimator($("#table"));
    },
    addCardOnTable: function(card) {
        card.set("real", true);
        var view = new App.Views.Card({model: card});
        view.render();
        this.setPosition(view, card.get("player"));
        this.$el.append(view.el);
        var that = this;
        this.animator.throwCard(view.$el, function() {
            if (gameTable.currentRound.isBattleFinished()) {
                //bitwa zakonczona
                gameTable.currentRound.handleFinishedBattle();
                that.animator.removeFromTable(gameTable.currentRound.currentBattle.winner.playerLocation, function() {
                    if (gameTable.currentRound.isRoundFinished()) {
                        gameTable.handleFinishedRound();
                        gameTable.initializeRound();
                        that.$el.empty();
                        players.dealCards();
                        prickup.setOnTable();
                        prickupView.render(); 
                    } else {
                        console.log(gameTable.currentRound.currentBattle.toString());
                        gameTable.currentRound.initialNewBattle();
                    }
                });
            } else {
                gameTable.currentRound.changeTurn();
            }
        });
    },
    setPosition: function(view, player) {
        var pploc = {};
        var className;

        switch (player.attributes.player.playerLocation) {
            case  PlayerPossition.TOP:
                pploc = this.animator.playersLoc.top;
                className = 'top';
                break;
            case  PlayerPossition.RIGHT:
                pploc = this.animator.playersLoc.right;
                className = 'right';
                break;
            case  PlayerPossition.BOTTOM:
                pploc = this.animator.playersLoc.bottom;
                className = 'bottom';
                break;
            case  PlayerPossition.LEFT:
                pploc = this.animator.playersLoc.left;
                className = 'left';
                break;
        }
        view.$el.css("position", "absolute").addClass(className).css(pploc);
    }
});



var tableCollection = new App.Collections.TableCards();
var tableView = new App.Views.TableCards({collection: tableCollection});
$("#table").append(tableView.el);


//=================================================
App.Views.Player = Backbone.View.extend({
    tagName: "li",
    initialize: function() {

    },
    events: {
        "click .bid-val": "wantPlay"
    },
    wantPlay: function() {
        var that = this;
        var target = 100;
        prickup.letThemGo(this.model, target, function() {
            prickup.reset();
            gameTable.currentRound.setLeaderAndTarget(that.model.get("player"), target);
        });
    },
    template: _.template($("#player-view").html()),
    render: function() {
        var cardView = new App.Views.Cards({collection: this.model.get("cards")});
        this.$el.append(this.template(this.model.toJSON())).append(cardView.render().el);
        return this;
    }
});

//=================================================
App.Collections.Players = Backbone.Collection.extend({
    model: App.Models.Player,
    dealCards: function(){
                 this.forEach(function(player) {
                            player.get("cards").reset();
                            var playerObject = player.get("player");
                            _.each(playerObject.getCards(), function(card) {
                                var cardModel = new App.Models.Card({card: card, player: player});
                                player.get("cards").add(cardModel);
                            });
                        });
    },
    getPlayerWithoutFullCardSet: function(){      
       return _.find(this.models, function(player) {
                return (player.cards.hasAllCards());
            });   
    }
});
//=================================================
App.Views.Players = Backbone.View.extend({
    tagName: "ul",
    className: "players",
    initialize: function() {
    },
    render: function() {
        this.collection.forEach(this.addPlayer, this);
        return this;
    },
    addPlayer: function(player) {
        var view = new App.Views.Player({model: player});
        this.$el.append(view.render().el);
    }
});
//=================================================

App.Collections.Prickup = Backbone.Collection.extend({
    model: App.Models.Card,
    setOnTable: function(){
        var that= this;
        _.forEach(gameTable.currentRound.prikup.getCards(), function(card) {
                            var cardModel = new App.Models.Card({card: card});
                            cardModel.hide();
                            that.add(cardModel);
                        }); 
    },
    showCards: function() {
        this.forEach(function(card) {
            card.show();
        });
    },
    addCardsToPlayer: function(playerModel){
          var playerObject = playerModel.get("player");
        var playerCardsObject = playerModel.get("cards");
                this.forEach(function(card) {
                    card.set("player", playerModel);
                    card.updateReferences();
                    playerCardsObject.add(card);
                    playerObject.addCard(card.get("card")); 
                });  
    },
    letThemGo: function(playerModel, target, callback) {    
        var that = this;
        if (target > 100) {
            this.showCards();
            setTimeout(function() {
                that.addCardsToPlayer(playerModel);
                callback();
            }, 10);
        } else {
            //na 100
            that.addCardsToPlayer(playerModel);
            this.showCards();
            callback();
        }


    }
});
//=================================================


App.Views.Prickup = Backbone.View.extend({
    className: "prickup",
    initialize: function() {
        this.collection.on("remove", this.removeCard, this);
        this.collection.on("reset", this.removeCards, this);
    },
    removeCards: function() {
        this.$el.empty();
    },
    removeCard: function(elem) {
        elem.destroy();
    },
    render: function() {
        this.collection.forEach(this.addCard, this);
        return this;
    },
    addCard: function(card) {
        var view = new App.Views.Card({model: card});
        this.$el.append(view.render().el);
    }
});


//=================================================
var players = new App.Collections.Players();
var prickup = new App.Collections.Prickup();



var gameTable = new GameTable();
//add players:
gameTable.players.addPlayer(new Player("adam", PlayerPossition.BOTTOM));
        gameTable.players.addPlayer(new Player("andrzej", PlayerPossition.LEFT));
        gameTable.players.addPlayer(new Player("xxx", PlayerPossition.RIGHT));

 gameTable.initializeRound();   


_.each(gameTable.players.getPlayers(), function(player) {

    var cardsCollection = new App.Collections.Cards();
    var playerModel = new App.Models.Player({player: player, cards: cardsCollection});

    var playerCards = player.getCards();

    _.each(playerCards, function(card) {
        var cardModel = new App.Models.Card({card: card, player: playerModel})
        cardsCollection.add(cardModel);
    });

    players.add(playerModel);
});


_.each(gameTable.currentRound.prikup.getCards(), function(card) {
    var model = new App.Models.Card({card: card});
    model.hide();
    prickup.add(model);

});

//players.forEach(function(player) {
//    console.log(player.get("player").playerName);
//    console.log(player.get("cards"));
//});

var playersView = new App.Views.Players({collection: players});


var prickupView = new App.Views.Prickup({collection: prickup});

$('#table').append(prickupView.render().el);
$('body').append(playersView.render().el);



