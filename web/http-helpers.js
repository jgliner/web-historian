var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var Promise = require('bluebird');
var _ = require('underscore');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

// As you progress, keep thinking about what helper functions you can put here!
exports.isLocal = function(url, cb) {
  url = url === '/' ? 'index.html' : url;
  new Promise(function(resolve, reject) {
    fs.readdir(archive.paths.siteAssets, function(err, contents) {
      if (err) {
        reject(err);
      }
      else {
        resolve(contents);
      }
    })
  })
  .then(function(localContents) {
    for (var i = 0; i < localContents.length; i++) {
      if (url === localContents[i] || url.match(/\/(archives)\/(sites\.txt)/igm)) {
        cb(true);
        return;
      }
    }
    cb(false);
    return;
  })
}

exports.serveAsset = function(req, res, url) {
  new Promise(function(resolve, reject) {
    //check if in site file
    fs.readFile(url, 'utf8', function(err, data){
      if (err) {
        throw err;
      }
      else if (req.url === '/') { //is index.html
        reject(data);
      }
      else { // is extfile
        resolve(data);
      }
    });
  }) //if html
  .catch(function(data) {
    res.writeHead(200, exports.headers);
    res.write(data);
    res.end();
  })
}