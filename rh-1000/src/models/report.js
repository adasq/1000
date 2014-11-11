var MongoModel = require('./mongoModel');

var Report = function(data){
  this.data = data || {};
  this._constructor = Report;
  this._mongoCollection = 'Reports';
};
Report.prototype = MongoModel.prototype;

module.exports = Report;