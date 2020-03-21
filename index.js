const fs = require('fs');
const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://covid19tracker.ca/dist/index.html?fbclid=IwAR2Dc8L3yqlEOhHh0GV53AiBZvcEpAUmbiXkv1UQuVDt_FydXYHb9XOAUvM';

let csv = [];

rp(url)
  .then(function(html){

    let headers = $("#dataTable thead tr", html);
    csv.push(headers.first().text().trim().split('\n').map(o=>o.trim()).join('\t'));

    let pp = $("#dataTable tbody tr", html);
    pp = Array.prototype.slice.call(pp);

    pp.forEach((patient, i) => {
      csv.push($(patient).text().trim().split('\n').map(o=>o.trim()).join('\t'));
    });

    // console.log(`csv.n = ` + csv.length);

    csv = csv.join('\n');

    fs.writeFile("./data.tsv", csv, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });
    csv = null;

  })
  .catch(function(err){
    //handle error
  });
