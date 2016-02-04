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

  // serve index.html
  if(req.url === '/'){
    new Promise(function(resolve, reject) {
      fs.readFile(archive.paths.siteAssets+'/index.html', 'utf8', function(err, data){
        if (err) {
          reject(err);
        }
        else {
          resolve(data);
        }
      });
    })
    .then(function(data) {
      res.writeHead(200, serve.headers);
      res.write(data);
      res.end();
    });
  }
  else {
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
