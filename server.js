var express = require('express');
var app = express();

var path = require('path');

var port = process.env.PORT || 8080;
var mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/storedurls';

var _ = require('lodash');

var shortid = require('shortid');

var mongo = require('mongodb').MongoClient;



var originalInsert = function(oURL, cb) {
    mongo.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection('urls');
        var doc = {
            original: oURL,
            small: shortenUrl(oURL)
        };
        collection.insert(doc, function(err, data){
            if (err) return cb(err, null);
            delete doc['_id'];
            cb(null, doc);
        });
        db.close();
    });
}

var shortSearch = function (sURL, cb) {
    mongo.connect(mongoUrl, function(err, db) {
        if (err) throw err;
        var collection = db.collection('urls');
        collection.find({
            small: sURL
        }).toArray(function(err, data) {
            if (err) return cb(err, null);
            cb(null, data[0].original);
        });
        db.close();
    });
}


// function to shorten the url
var shortenUrl = function(url) {    
    var newUrl = shortid.generate();
    return newUrl;
};


app.use('/static', express.static('public'));

// get new url suggested
app.put('/new/:url(*)', function(req, res) {
    var originalUrl = req.params.url;
    originalInsert(originalUrl, function(err, result) {
        if(err) return res.sendStatus(500);
        res.json(result);
    });
});

// Return homepage
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'templates/index.html'));
});

// if url is accessed send user to actual site
// get and res.redirect()
app.get(/\/(.+)/, function(req, res) {
    var shortUrl = req.params[0];
    shortSearch(shortUrl, function(err, originalUrl){
        if(originalUrl) res.redirect(originalUrl);
        else res.sendStatus(404);
    });
});

var listener = app.listen(port);
