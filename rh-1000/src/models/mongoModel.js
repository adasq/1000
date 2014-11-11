
var db = require('../db/connect'),
q = require('q'),
_= require('underscore');

//=====================================================================================
var MongoModel = function(){};
MongoModel.prototype._db = db; 
//--------------------------

MongoModel.prototype.getAll = function(constraints){
	var that=this, deferred = q.defer();

  this._db[this._mongoCollection].find(constraints).exec(function(err, artists){
  	if(!err){
  		artists = _.map(artists, function(artistData){
  			var artist = new that._constructor();
  			artist.data = artistData;
  			return artist;
  		});
  		deferred.resolve(artists);
  	}else{
  		deferred.reject(err);
  	}
});
  return deferred.promise;
};
//--------------------------
MongoModel.prototype.save = function(){
	var that=this, deferred = q.defer(); 
	if(this.data._id){
		console.log('[mongo]updating')
		//update
		 this.data.save(function(err, artist){
		  	if(!err){ 
		  		that.data = artist;
		  		deferred.resolve(artist);
		  	}else{ 
		  		deferred.reject(err);
		  	}
		});		
	}else{
		console.log('[mongo]save');
		var model = new this._db[this._mongoCollection](that.data);
		model.save(function(err, model){
			if(err){
				deferred.reject(err);
			}else{
				that.data = model;
				deferred.resolve();
				
			}
		});
	}
  return deferred.promise;
};

module.exports = MongoModel;