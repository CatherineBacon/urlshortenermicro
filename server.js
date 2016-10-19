var express = require('express');
var app = express();

var path = require('path');

var port = process.env.PORT || 8080;

var fs = require('fs');

var _ = require('lodash');

var shortid = require('shortid');

// read in library file - use mongodb
var sites = {};

var mongo = require('mongodb').MongoClient;
var mongoUrl = 'mongodb://localhost:27017/storedurls';
var originalSearch = function(oURL) {
    mongo.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection('urls');
        collection.find({
            original: oURL
        }).toArray(function(err, data) {
            if (err) return 'not there';
            return 'already there';
        });
        db.close();
    });
}

var originalInsert = function(oURL) {
    mongo.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection('urls');
        collection.insert({
            original: oURL,
            small: shortenUrl(oURL)
        }, function(err, data){
            if (err) throw err;
            return
        });
        db.close();
    });
}

var shortSearch = function (sURL) {
    mongo.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection('urls');
        collection.find({
            small: sURL
        }).toArray(function(err, data) {
            if (err) return 'not there';
            return data.original;
        });
        db.close();
    });
}


// function to shorten the url
// needs updating
var shortenUrl = function(url) {
    
    var newUrl = shortid.generate();
    return newUrl;
};


// get new url suggested
app.put('/new/:url(*)', function(req, res) {
    var originalUrl = req.params.url;
    var shortUrl;
    originalInsert(originalUrl);
    res.json( { 'original-url': originalUrl, 'new-url': shortUrl } )
});

// if url is accessed send user to actual site
// get and res.redirect()
app.get('/:shortUrl(*)', function(req, res) {
    var shortUrl = req.params.shortUrl;
    var longUrl = _.findKey(sites, function(val) {
        return val == shortUrl;
    } );
    if (longUrl) res.redirect(longUrl);
    else res.sendStatus(404);
});

var listener = app.listen(port);
