var
_ = require('underscore'),
Artist = require('../models/artist'),
Report = require('../models/report');

var routes = [
{
	url: "/getReports",
	callback: function (req, res) {
		var report = new Report();
		report.getAll().then(function(reports){
			res.send({response: reports, error: false});
		});
	}
},
{
	url: "/getArtists",
	callback: function (req, res) {
		var artist = new Artist();
		artist.getAll().then(function(artists){
			res.send({response: artists, error: false});
		});
	}
}
];

module.exports = routes; 