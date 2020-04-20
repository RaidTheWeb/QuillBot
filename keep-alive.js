var http = require('http');

http.createServer(function (req, res) {
  res.write("QuillBot is Live...");
  res.end();
}).listen(8080);