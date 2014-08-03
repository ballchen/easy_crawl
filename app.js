var request = require('request');
var _ = require('underscore');
var cheerio = require('cheerio');
var fs = require('fs');
var async = require('async');
var iconv = require('iconv-lite');

var hypagedata = {
	sel_year: "2014",
	sel_month: "7",
	HYPAGE: "place_query.htm",
	service_uid: "014005"
};
var alldata = []; 


async.series([
	function(callback){


		hypagedata.sel_month = 8;
		request.post("http://www.e-services.taipei.gov.tw/hypage.cgi",{form: hypagedata, encoding: null},function(err, res, body){
			var body = iconv.decode(new Buffer(body), "big5");
			
			$ = cheerio.load(body);
			

			$('tr[bgcolor=#85BED3]').each(function(i, element){

				var newdata = {
					date: $(this).find('td[width="11%"]').text(),
					time: $(this).find('td[width="10%"]').text(),
					place: $(this).find('td[width="20%"]').text(),
					name: $(this).find('td[width="19%"]').text()
				}

				setTimeout(function(){
					request.get("http://maps.googleapis.com/maps/api/geocode/json?address="+newdata.place+"&sensor=true_or_false",function(err, res, body){
						body = JSON.parse(body);
						console.log(body.status);
						if(body.status == 'OK'){
						
							newdata = _.extend(newdata, {latitude: body.results[0].geometry.location.lat,
												longitude: body.results[0].geometry.location.lng});
						}
						alldata.push(newdata);
						
					})

				},5000)
				

			})

			setTimeout(function(){
				callback(null, "1")
			},20000)


		})
		
	}
	
],function(err, results){


		fs.writeFile('hypage8.json',JSON.stringify(alldata) ,function(err){
			if(err) throw err;
			console.log("saved!");

		});
		
	});








