/* Any copyright is dedicated to the Public Domain.
 * http://creativecommons.org/publicdomain/zero/1.0/
 */

var qs = require("querystring");
var MAX_ID = 1e9;

function Shortener() {
  this.urls = {};
}

Shortener.prototype = {
  /**
   * Returns an available, random ID string between 0 and MAX_ID in radix 36.
   */
  getAvailableId: function () {
    function genId() {
      return Math.floor(Math.random() * MAX_ID).toString(36);
    }
    var id = genId();

    while (this.urls.hasOwnProperty(id))
      id = genId();

    MAX_ID++;

    return id;
  },
  /**
   * Handler for POST /shorten.
   *
   * @param http.IncomingMessage req
   *        The request to respond to.
   * @param http.ServerResponse res
   *        The response object to write to.
   */
  shorten: function (req, res) {
    if (req.method !== "POST") {
      // Method not allowed.
      return this.writeEmptyResponse(res, 405, {"Allow": "POST"});
    }

    if (req.headers["content-type"] !== "application/x-www-form-urlencoded") {
      // Unsupported Media Type
      return this.writeEmptyResponse(res, 415);
    }

    var body = "";
    req.on("data", function (data) {
      body += data;
    });

    req.on("end", function () {
      var params = qs.parse(body);
      if (!params.link) {
        // Bad request.
        return this.writeEmptyResponse(res, 400);
      }

      var link = params.link;
      var id = this.getAvailableId();
      this.urls[id] = link;

      res.write(id);
      res.end("\n");
    }.bind(this));
  },

  /**
   * Handler for GET /:id
   * @param http.IncomingMessage req
   *        The request to respond to.
   * @param http.ServerResponse res
   *        The response object to write to.
   */
  redirect: function (req, res) {
    // Strip / from the beginning.
    var id = req.url.substr(1);

    if (this.urls.hasOwnProperty(id)) {
      var url = this.urls[id];
      this.writeEmptyResponse(res, 301, {"Location": url});
    } else {
      this.writeEmptyResponse(res, 404);
    }
  },

  /**
   * Sets a response code, headers and ends the response.
   *
   * @param http.ServerResponse res
   *        The response object to write to.
   * @param Number code
   *        The HTTP status code to return.
   * @param Object headers
   *        An optional object containing headers to return.
   */
  writeEmptyResponse: function (res, code, headers) {
    res.writeHead(code, headers);
    res.end();
  },
};

exports.Shortener = Shortener;
