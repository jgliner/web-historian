var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var serve = require("./http-helpers.js");
var request = require('request');
var Promise = require('bluebird');
// serveAssets = function(res, asset, callback)
// require more modules/folders here! 

exports.handleRequest = function (req, res) {
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
  // console.log(result);

};
