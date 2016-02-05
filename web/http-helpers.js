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

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
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
      console.log(localContents[i], url, url===localContents[i])
      if (url === localContents[i] || url.match(/\/(archives)\/(sites\.txt)/igm)) {
        cb(true);
        return;
      }
    }
    cb(false);
  })
}