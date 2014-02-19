$(function(){

  var Todo = Backbone.Model.extend({


    defaults: function() {
      return {
        url: "url",
		title: "title",
         contentType: 0,
        order: Todos.nextOrder(),
		date: 1234543456,
          visible: true
      };
    },

    initialize: function() {
      if (!this.get("title")) {
          this.set({"title": this.defaults().title});
      }
    },
    hide: function(){
        this.set({"visible": false});
     },

     show: function(){
          this.set({"visible": true});
      },
    toggle: function() {
      this.save({done: !this.get("done")});
    }

  });

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TodoList = Backbone.Collection.extend({

    // Reference to this collection's model.
    model: Todo,

    // Save all of the todo items under the `"todos-backbone"` namespace.
    localStorage: new Backbone.LocalStorage("nazas"),

    // Filter down the list of all todo items that are finished.
    done: function() {
      return this.filter(function(todo){ return todo.get('done'); });
    },
    visible: function(){
      return this.filter(function(todo){
          return todo.get("visible");
      });
    },
    hidden: function(){
      return this.without.apply(this, this.visible());
    },

    all: function(){
          return this.filter(function(todo){  return true;       });
      },
    getByCategory: function(ct) {
          return this.filter(function(todo){  return (todo.get('category') == ct);       });
      },


    // Filter down the list to only todo items that are still not finished.
    remaining: function() {
      return this.without.apply(this, this.done());
    },

    // We keep the Todos in sequential order, despite being saved by unordered
    // GUID in the database. This generates the next order number for new items.
    nextOrder: function() {
      if (!this.length) return 1;
      return this.last().get('order') + 1;
    },

    // Todos are sorted by their original insertion order.
    comparator: function(todo) {
      return todo.get('order');
    }

  });

  // Create our global collection of **Todos**.
  var Todos = new TodoList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var TodoView = Backbone.View.extend({

    //... is a list tag.
    tagName:  "li",

    // Cache the template function for a single item.
	/*
    template: (function(){
		console.log(this.model.get("category"));
		return _.template($('#item-template').html());
	})(),
*/
    // The DOM events specific to an item.
    events: {	
	  "click .delete" : 	"clear",
	  "click .clipboard" : 	"copyAddress",  		
      "mouseover .gif":    "showGif",
      "mouseout .gif":    "hideGif",
      "mouseover .item-view": "showOptions",
      "mouseout .item-view": "hideOptions",
	  "mouseout .clipboard-field": "closeCopyAddress"
    },
		copyAddress: function(){	
		var clipboard = this.$el.find(".clipboard-field");	
		  clipboard.addClass("show");
		  clipboard.select();
		},	
		closeCopyAddress: function(){	
		var clipboard = this.$el.find(".clipboard-field");	
		  clipboard.removeClass("show");
		},	
		
		
		
      showOptions: function(e){			
          this.$el.find(".options").addClass("showOption");
      },
      hideOptions: function(){
          this.$el.find(".options").removeClass("showOption");
	
      },



    // The TodoView listens for changes to its model, re-rendering. Since there's
    // a one-to-one correspondence between a **Todo** and a **TodoView** in this
    // app, we set a direct reference on the model for convenience.
    initialize: function() {
      this.listenTo(this.model, 'change', this.render);
      this.listenTo(this.model, 'destroy', this.remove);
		var template;
		switch(this.model.get("payloadType")){
			case PayloadType.YOUTUBE:
			template = '#item-template-yt';
			break;	
			case PayloadType.GIF:
			template = '#item-template-gif';
			break;	
			case PayloadType.PDF:
			template = '#item-template-pdf';
			break;	
			case PayloadType.IMAGE:
			template = '#item-template-img';
			break;	
			case PayloadType.WEBPAGE:
			template = '#item-template-default';
			break;		
		};			
		//alert(template);
		this.template= _.template($(template).html());
 
	
	
    },

      showGif: function(){
          var gif =  this.$el.find(".gif");
          gif.attr('src', gif.parent().attr("href"));
         // $(this).attr('src', $(this).parent().attr("href"));
      },
      hideGif: function(){
          var gif =  this.$el.find(".gif");
          gif.attr('src', gif.attr("data-url"));
      },
    // Re-render the titles of the todo item.
    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('done', this.model.get('done'));
      this.$el.toggleClass('show', this.model.get('visible'));
       
	   this.$(".date").prettyDate(); 	  
	  this.clipboard = this.$(".clipboard-field");	
	  this.clipboard.val(this.model.get("url"));

      return this;
    },
 
 
    // Remove the item, destroy the model.
    clear: function() {
      this.model.destroy();
    }

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#nazasapp"),

    // Our template for the line of statistics at the bottom of the app.
    statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
        "click .show-image" : "showImage",
        "click .show-gif" : "showGif",
        "click .show-webpage" : "showWebpage",
        "click .show-pdf" : "showPdf",
		 "click .show-video" : "showVideo",
        "click .show-all" : "showAll",
            "keypress #new-todo":  "createOnEnter",
          "click #clear-completed": "clearCompleted",
          "click #toggle-all": "toggleAllComplete"
    },


      showImage: function(){
          this.show(Todos.getByCategory(Category.IMAGE));
      },
	   showVideo: function(){
          this.show(Todos.getByCategory(Category.VIDEO));
      },
      showPdf: function(){
          this.show(Todos.getByCategory(Category.PDF));
      },
	  showGif: function(){
          this.show(Todos.getByCategory(Category.GIF));
      },
      showWebpage: function(){
          this.show(Todos.getByCategory(Category.WEBPAGE));
      },
	  
      showAll: function(){
          Todos.each(function (item) { item.save({'visible': true}); });
      },




    show: function(itemsToShow){
        _.each(Todos.without.apply(Todos, itemsToShow), function(item){item.hide();   } );
        _.each(itemsToShow, function(item){ item.show();  } );
    },
    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {

      this.input = this.$("#new-todo");
      this.allCheckbox = this.$("#toggle-all")[0];

      this.listenTo(Todos, 'add', this.addOne);
      this.listenTo(Todos, 'reset', this.addAll);
      this.listenTo(Todos, 'all', this.render);

      this.footer = this.$('footer');
      this.main = $('#main');

      Todos.fetch();
    },

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      var done = Todos.done().length;
      var remaining = Todos.remaining().length;

      if (Todos.length) {
        this.main.show();
        this.footer.show();
        this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
      } else {
        this.main.hide();
        this.footer.hide();
      }

     
    },

    // Add a single todo item to the list by creating a view for it, and
    // appending its element to the `<ul>`.
    addOne: function(todo) {
      var view = new TodoView({model: todo});
      this.$("#item-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      Todos.each(this.addOne, this);
    },

    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      if (!this.input.val()) return;

      Todos.create({title: this.input.val()});
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.invoke(Todos.done(), 'destroy');
      return false;
    },

    toggleAllComplete: function () {
      var done = this.allCheckbox.checked;
      Todos.each(function (todo) { todo.save({'done': done}); });
    }

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
