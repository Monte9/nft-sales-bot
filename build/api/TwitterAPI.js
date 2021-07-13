"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _twit = _interopRequireDefault(require("twit"));

var TwitterAPI = /*#__PURE__*/function () {
  function TwitterAPI(consumer_key, consumer_secret, access_token, access_token_secret) {
    (0, _classCallCheck2["default"])(this, TwitterAPI);
    this.consumer_key = consumer_key;
    this.consumer_secret = consumer_secret;
    this.access_token = access_token;
    this.access_token_secret = access_token_secret;
    this.api = new _twit["default"]({
      consumer_key: this.consumer_key,
      consumer_secret: this.consumer_secret,
      access_token: this.access_token,
      access_token_secret: this.access_token_secret,
      timeout_ms: 60 * 1000,
      strictSSL: true
    });
  }

  (0, _createClass2["default"])(TwitterAPI, [{
    key: "postTweet",
    value: function postTweet(content) {
      this.api.post('statuses/update', {
        status: content
      }, function (err, data, response) {
        if (err != null) {
          console.log("Oops! Unable to post the Tweet:", err.allErrors[0] && err.allErrors[0].message);
        } else {
          console.log("Tweet posted!");
        }
      });
    }
  }]);
  return TwitterAPI;
}();

exports["default"] = TwitterAPI;
//# sourceMappingURL=TwitterAPI.js.map