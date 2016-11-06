# url shortener microserver

## Introduction 

Built for a project which was part of the FreeCodeCamp course: https://www.freecodecamp.com/challenges/url-shortener-microservice. The aim was to build a url shortener like bit.ly or goog.le etc.

## How it works

Uses an html form. The user submits to url. The use `valid-url` package to check if input is a valid url. 

Uses `shortid` to generate a short id number for inclusion after the home url - this is the shortening process. The value is stored in `mongodb` in the form `{ original: original.url, small: shortened.url }`.

When a user vistis `home/shortid` the full url is access from mongo and then use `res.redirect()` to send the user to the original webpage.


## Note
The host url is so long this would only actually shorten the most unweildy urls! (he he)
