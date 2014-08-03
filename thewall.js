var request = require('request');
var _ = require('underscore');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require('async');
var iconv = require('iconv-lite');
var alldata = [];
request.get("http://thewall.tw/shows?ground=%E5%85%AC%E9%A4%A8",{encoding: null} ,function(err, res, body){
	var bigbody = iconv.decode(new Buffer(body), "utf-8");
	$ = cheerio.load(bigbody);
	$('div[class=span3]').each(function(i, element){
		var m = $(this).find('table div.date div.m').text()
		var d = $(this).find('table div.date div.d').text()
		
		var date = "2014/"+m+"/"+d;
		var name = $(this).find('table div.title a').text();

		var time = $(this).find('table tbody').children().last().children().last().text();
		var place = "THE WALL 公館";
		var lan = "25.011634";
		var lng = "121.535507";


		var newobj = {
			time: date+" "+time,
			latitude: lan,
			longitude: lng,
			name: name,
			place: place
		}
		console.log(newobj);
		alldata.push(newobj);
		
	})
})


setTimeout(function(){
	fs.writeFile('thewall.json',JSON.stringify(alldata),function(err){
		if(err) throw err;
		console.log("saved!");
	})
},5000)