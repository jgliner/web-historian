var fs = require('fs');
var path = require('path');
var archive = require('../helpers/archive-helpers');
var helpers = require("./http-helpers.js");
var Promise = require('bluebird');
// serveAssets = function(res, asset, callback)
// require more modules/folders here! 

exports.handleRequest = function (req, res) {
  console.log('REQ',req.url);

  // serve index.html and loading.html
  var url = req.url === '/' ? archive.paths.siteAssets+'/index.html' : req.url;

  if(req.method === 'GET'){

    // method to discern local GET vs. external GET
    helpers.isLocal(req.url, function(isLocal) {
      if (isLocal) {
        helpers.serveAsset(req, res, url);
      }
      else {
        archive.isUrlArchived(req.url, function(isInArchive) {
          if (isInArchive) {
            helpers.serveAsset(req, res, archive.paths.archivedSites+url);
          }
          else {
            helpers.throw404(req, res);
          }
        })
      }
    })
  }
  else if (req.method === 'POST') {
    //write to list
    req.on('data', function(data) {
      var url = data.toString().replace(/url\=/igm,'')+'\n';
      fs.writeFile(archive.paths.list, url, 'utf8');
      res.writeHead(302, helpers.headers);
      res.end();
    });
  }

};
