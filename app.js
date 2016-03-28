// Get dependencies
const express = require('express');
const proxy = require('http-proxy-middleware');
const path = require('path');
const http = require('http');

process.on('uncaughtException', function(err) {
  console.log('Oooops ~~~~ uncaughtException = ' + err.stack);
});

const app = express();

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/v1', proxy({
  target: process.env.API_SERVER,
  changeOrigin: true
}));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, './dist/index.html'));
});

/**
 * Create HTTP server.
 */
const server = http.createServer(app);
var port = process.env.PORT || 3000;
/**
 * Listen on provided port, on all network interfaces.
 */


server.listen(port);
server.on('error', onError);
server.timeout = 30000;

function onError(error) {
  console.log(error);

  if (error.syscall !== 'listen') {
    console.log('error');
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  switch (error.code) {
    case 'EACCESS':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
