var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var serve = require("./http-helpers.js");
var request = require('request');
var Promise = require('bluebird');
// serveAssets = function(res, asset, callback)
// require more modules/folders here! 

exports.handleRequest = function (req, res) {
  console.log('REQ',req.url);
  // serve index.html and loading.html
  var url = req.url === '/' ? archive.paths.siteAssets+'/index.html' : req.url;
  if(req.method === 'GET'){
    //if GET
    new Promise(function(isExtFile, isIndex) {
      //check if in site file
      fs.readFile(url, 'utf8', function(err, data){
        if (err) {
          throw err;
        }
        else if (req.url === '/') { //is index.html
          isIndex(data);
        }
        else { // is extfile
          isExtFile(data);
        }
      });
    }) //if html
    .catch(function(data) {
      res.writeHead(200, serve.headers);
      res.write(data);
      res.end();
    })
    .then(function(data) {
      //is site in sites.txt?
      archive.isUrlInList(data, function(isInList){
        //if yes
        if (isInList) {
          //check if in sites folder
            //if yes
              //serve archived file
            //if no
                  //send request (to worker?)
        }
        else {
          //if no
          archive.addUrlToList(url, function() {
            //put it on sites.txt file
            fs.writeFile(archive.paths.list, url, 'utf8');
          });
        }
      });
    });

  }
  else if (req.method === 'POST') {
    //write to list
    req.on('data', function(data) {
      var url = data.toString().replace(/url\=/igm,'')+'\n';
      fs.writeFile(archive.paths.list, url, 'utf8');
      res.writeHead(302, serve.headers);
      res.end();
    });
  }
  else {
    //does what worker does, retrieves external sites which are not in sites.txt file
    new Promise(function(resolve, reject) {
      request('http:/'+req.url, function(err, res, data){
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    })
    .then(function(data) {
      //save file to our archive
      res.writeHead(200, serve.headers);
      res.write(data);
      res.end();
    })
    .catch(function(err) {
      res.writeHead(404, serve.headers);
      res.end();
    });
  }
  // console.log(result);

};
