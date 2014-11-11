
var config = require('../../config').db,
model = require('./model'),
mongoose = require('mongoose');

db = mongoose.connect(config.connectionURI);

module.exports =  {
	Artists: model.Artists(db),
	Reports: model.Reports(db)
};