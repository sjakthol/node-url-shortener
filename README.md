A simple in-memory URL shortener service written in node.js.

## Running
Run `npm start` or `node main.js` to start the server listening on port 3000. Custom port can be specified in PORT environmental variable.

## Usage
* POST /shorten with the URL as `link` parameter.
  * Returns a short id to be used later to access the URL.
  * Example: `curl --data "link=https%3A%2F%2Fgoogle.fi%2Ffoo%2Fbar%3Fbaz%26foo" localhost:3000/shorten`
* GET /:id to access previously shortened link.
  * If URL with :id exists a 301 redirect is performed or 404 is returned otherwise.

## Copyright
Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
