"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

var OpenSeaAPI = /*#__PURE__*/function () {
  function OpenSeaAPI() {
    (0, _classCallCheck2["default"])(this, OpenSeaAPI);
    (0, _defineProperty2["default"])(this, "boredApeContract", '0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d');
    (0, _defineProperty2["default"])(this, "blueBeamsApeId", '5828');
    (0, _defineProperty2["default"])(this, "eventType", 'successful');
  }

  (0, _createClass2["default"])(OpenSeaAPI, [{
    key: "getNFT",
    value: function () {
      var _getNFT = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
        var url, params, options;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                url = 'https://api.opensea.io/api/v1/events';
                params = "only_opensea=false&offset=0&limit=20&asset_contract_address=".concat(this.boredApeContract, "&token_id=").concat(this.blueBeamsApeId, "&event_type=").concat(this.eventType);
                options = {
                  method: 'GET',
                  headers: {
                    Accept: 'application/json'
                  }
                };
                _context.next = 5;
                return (0, _nodeFetch["default"])("".concat(url, "?").concat(params), options).then(function (res) {
                  return res.json();
                })["catch"](function (err) {
                  return console.error('error:' + err);
                });

              case 5:
                return _context.abrupt("return", _context.sent);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getNFT() {
        return _getNFT.apply(this, arguments);
      }

      return getNFT;
    }()
  }]);
  return OpenSeaAPI;
}();

exports["default"] = OpenSeaAPI;
//# sourceMappingURL=OpenSeaAPI.js.map