/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

var http = require("http");
var shortener = require("./shortener");
var DEFAULT_PORT = 3000;

var service = new shortener.Shortener();
var server = http.createServer(function (req, res) {
  if (req.url === "/shorten") {
    service.shorten(req, res);
  } else {
    service.redirect(req, res);
  }
});

var port;
if (process.env.PORT) {
  port = parseInt(process.env.PORT);
}

if (!port || isNaN(port)) {
  port = DEFAULT_PORT;
}

console.log("Listening on port " + port);

server.on("error", function(err) {
  console.log(err.toString())
  console.log("Failed to bind to port " + port);
});

server.listen(port);
