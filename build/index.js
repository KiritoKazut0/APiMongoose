"use strict";

var _express = _interopRequireDefault(require("express"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var app = (0, _express["default"])();
var Port = 8080;
app.listen(Port, function () {
  console.log("On Port : " + Port);
});