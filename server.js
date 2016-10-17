var express = require('express');
var app = express();

var path = require('path');

var port = process.env.PORT || 8080;

var fs = require('fs');

// read in library file - use mongodb
var sites = {};


// function to shorten the url
var shortenUrl = function(url) {
    var newUrl = url + '/bum';
    return newUrl;
};


// get new url suggested
app.put('/new/:url(*)', function(req, res) {
    var originalUrl = req.params.url;
    var shortUrl;
    // check if url is already in dictionary, if so return shortened version
    if (originalUrl in sites) {
        shortUrl = sites[originalUrl];
    } else {
        // add it to the dictionary, generate the short url and return to user
        
        shortUrl = shortenUrl(originalUrl);
        sites[originalUrl] = shortUrl;
    }
    res.json( { 'original-url': originalUrl, 'new-url': shortUrl } )
});

// if url is accessed send user to actual site
// get and res.redirect()

var listener = app.listen(port);
