if (process.env.NODE_ENV === "production") {
  require('nodetime').profile({
    accountKey: 'a0df5534478dd2873fcc0789e958749f2a356908', 
    appName: 'InstaCab Dispatcher'
  });

  require("bugsnag").register("889ee967ff69e8a6def329190b410677");
}

var Dispatcher = require('./dispatch'),
    // agent = require('webkit-devtools-agent'),
    WebSocketServer = require('ws').Server,
    express = require('express'),
    inspect = require('util').inspect;

var dispatcher = new Dispatcher();

dispatcher.load(function(err) {
  if (err) return console.log(err);

  var app = express();
  var port = process.env.PORT || 9000;
  var server = app.listen(port);
  console.log('Dispatcher started on port %d', port);

  var wss = new WebSocketServer({ server: server });

  wss.on('connection', function(connection) {
    console.log('socket client connected');

    connection.on('message', function(data) {
      dispatcher.processMessage(data, connection);
    });

    connection.on('close', function() {
      console.log('socket client disconnected');
    });

    connection.on('error', function(reason, code){
      console.log('socket error: reason ' + reason + ', code ' + code);
    })
  });

})

// Middleware
// app.use(express.bodyParser())
// app.use(app.router)
// app.use((err, req, res, next) ->
//   console.error(err.stack)

//   // res.status(err.status || 500)
//   res.send('500', { messageType: 'Error', text: err.message })
// )

// Routes
// app.post('/', (req, resp) ->
//   // set default content type
//   resp.contentType('application/json; charset=utf-8')

//   console.log("Process message")
//   console.log(req.body)

//   requestContext = new RequestContext(
//     request: req
//     requestBody: req.body
//     response: resp
//   )

//   dispatch.processMessage(requestContext)
// )

// Events happening on clients
// app.post('/mobile/event', (req, resp) ->
//   console.log(req.body)

//   // TODO: Писать в MongoDB или в PostgreSQL с полем json

//   // db.collection('events').insert( req.body, (err, result) ->
//   //   console.log(result)
//   // )
  
//   resp.writeHead(200, 'Content-Type': 'text/plain');
//   resp.end()
// )