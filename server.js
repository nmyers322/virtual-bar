require("dotenv").config();
var path = require("path");
var express = require("express");
var webpack = require("webpack");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var cookieParser = require('cookie-parser');
var axios = require('axios');
var xss = require('xss');
var validateUuid = require('uuid-validate');

var app = express();

const calculateAuthHeaderValue = () => 
  Buffer.from(process.env.TWILIO_API_KEY + ':' + process.env.TWILIO_API_SECRET).toString('base64');

app.use(cookieParser());
if(process.env.NODE_ENV === "DEV") { // Configuration for development environment
    var webpackDevMiddleware = require("webpack-dev-middleware");
    var webpackHotMiddleware = require("webpack-hot-middleware");
    var webpackConfig = require("./webpack.config.js");
    const webpackCompiler = webpack(webpackConfig);
    app.use(webpackDevMiddleware(webpackCompiler, {
      hot: true
    }));
    app.use(webpackHotMiddleware(webpackCompiler));
    app.use(express.static(path.join(__dirname, "app")));
    app.get("/lobby", (req, res) => {
      res.writeHead(301,{Location: 'http://localhost:3000?redirect=lobby'});
      res.end();
    });
    app.get("/platform", (req, res) => {
      res.writeHead(301,{Location: 'http://localhost:3000?redirect=platform'});
      res.end();
    });
    app.get("/table/:tableId", (req, res) => {
      res.writeHead(301,{Location: 'http://localhost:3000?redirect=table&tableId=' + req.params.tableId});
      res.end();
    });
} else if(process.env.NODE_ENV === "PROD") { // Configuration for production environment
    app.use(express.static(path.join(__dirname, "dist")));
}

app.use(function(req, res, next){
    console.log("Request from: ", req.url);
    next();
})

// Endpoint to generate access token
app.get("/api/token", function(request, response) {
    var identity = request.cookies && request.cookies['id'] ? request.cookies['id'] : 'Anonymous';

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    var token = new AccessToken(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_API_KEY,
        process.env.TWILIO_API_SECRET
    );

    // Assign the generated identity to the token
    token.identity = identity;

    const grant = new VideoGrant();
   // Grant token access to the Video API features
   token.addGrant(grant);

   // Serialize the token to a JWT string and include it in a JSON response
   response.send({
       identity: identity,
       token: token.toJwt()
   });
});

// Endpoint to get active rooms
app.get("/api/rooms", (request, response) => {
  let options = {
    url: 'https://video.twilio.com/v1/Rooms',
    method: 'get',
    headers: {
      'Authorization': 'Basic ' + calculateAuthHeaderValue()
    }
  };
  axios(options)
    .then(twilioResponse => {
      console.log(JSON.stringify(twilioResponse.data));
      var responseBody = {
        rooms: twilioResponse.data.rooms
          .filter(room => room.status === 'in-progress')
          .map(room => room.unique_name)
      }
      response.send(JSON.stringify(responseBody));
    })
    .catch(err => {
      console.log('twilio error');
      console.log(err);
      response.status(503);
      response.send("Error contacting downstream service");
    });
});

// Endpoint to get participants for a room
app.get("/api/room/:roomId/participants", (request, response) => {
  var roomId = xss(request.params.roomId);
  if (!validateUuid(roomId)) {
    response.status(400);
    response.send("Invalid roomId");
    return;
  }
  let options = {
    url: 'https://video.twilio.com/v1/Rooms/' + roomId + '/Participants',
    method: 'get',
    headers: {
      'Authorization': 'Basic ' + calculateAuthHeaderValue()
    }
  };
  axios(options)
    .then(twilioResponse => {
      console.log(JSON.stringify(twilioResponse.data));
      var responseBody = {
        participants: twilioResponse.data.participants
          .filter(dude => dude.status === 'connected')
          .map(dude => dude.identity)
      }
      response.send(JSON.stringify(responseBody));
    })
    .catch(err => {
      console.log('twilio error');
      console.log(err);
      response.status(503);
      response.send("Error contacting downstream service");
    });
});


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Express server listening on *:" + port);
});