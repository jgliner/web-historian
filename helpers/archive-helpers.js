var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Promise = require('bluebird');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  new Promise(function(resolve, reject) {
    fs.readFile(exports.paths.list, 'utf8', function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  })
  .then(function(data) {
    cb(data.split('\n'));
  })
};

exports.isUrlInList = function(target, cb) {
  return exports.readListOfUrls(function(urls) {
    urls.forEach(function(url) {
      if (url === target) {
        cb(true);
      }
    });
    cb(false);
  });
};

exports.addUrlToList = function(url, cb) {
  cb(url+'\n');
};

exports.isUrlArchived = function(url, cb) {
  new Promise(function(resolve, reject) {
    fs.readdir(exports.paths.archivedSites, function(err, data) {
      if (err) {
        reject(err);
      }
      else {
        resolve(data);
      }
    });
  })
  .then(function(sitenames) {
    for (var i = 0; i < sitenames.length; i++) {
      if (sitenames[i] === url.slice(1)) {
        cb(true);
        return;
      }
    }
    cb(false);
  });
};

exports.downloadUrls = function(req, res) {
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
};
