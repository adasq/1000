
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

//------------------------------------------
var Artists = new Schema({
   name     : {type: String, unique: true, required: true}, 
   img : {type: String, unique: true, required: false}, 
   spreadsheetId : {type: String, unique: true, required: true}, 
   lastEpisode     : {type: Number, required: true},
});

mongoose.model('Artists', Artists);
exports.Artists = function(db) {
  return db.model('Artists');
};
//-------------------------------------------
var Reports = new Schema({
   date	: {type: Date, default: new Date()},
   _creator: { type: Schema.Types.ObjectId, ref: 'Artists' },
   totalTime : {type: Number, required: true},
   fileName: {type: String, required: true}, 
   fileEpisode : {type: Number, required: true},
   fileLink: {type: String, required: true}
});

mongoose.model('Reports', Reports);
exports.Reports = function(db) {
  return db.model('Reports');
};