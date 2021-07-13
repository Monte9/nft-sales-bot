"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

require("dotenv/config");

var _OpenSeaAPI = _interopRequireDefault(require("./api/OpenSeaAPI"));

var _TwitterAPI = _interopRequireDefault(require("./api/TwitterAPI"));

var TwitterMcBot = /*#__PURE__*/function () {
  function TwitterMcBot() {
    (0, _classCallCheck2["default"])(this, TwitterMcBot);
    this.asset_range = 10;
    this.twitterAPI = new _TwitterAPI["default"](process.env.TWITTER_CONSUMER_KEY, process.env.TWITTER_CONSUMER_SECRET, process.env.TWITTER_ACCESS_TOKEN, process.env.TWITTER_ACCESS_TOKEN_SECRET);
    this.openSeaAPI = new _OpenSeaAPI["default"]();
  }

  (0, _createClass2["default"])(TwitterMcBot, [{
    key: "runInstance",
    value: function () {
      var _runInstance = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var saleEvents;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                console.log("Running Twitter McBot"); // Get latest events for the NFT

                _context.next = 3;
                return this.openSeaAPI.getNFT();

              case 3:
                saleEvents = _context.sent;
                console.log(saleEvents); // Post a tweet

                this.twitterAPI.postTweet("Another one.. from the NFT Flipping McBot!");

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function runInstance() {
        return _runInstance.apply(this, arguments);
      }

      return runInstance;
    }()
  }]);
  return TwitterMcBot;
}();

var twitterBot = new TwitterMcBot();
twitterBot.runInstance();
//# sourceMappingURL=index.js.map