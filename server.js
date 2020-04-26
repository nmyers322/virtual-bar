require("dotenv").config();
var path = require("path");
var express = require("express");
var webpack = require("webpack");
var AccessToken = require("twilio").jwt.AccessToken;
var VideoGrant = AccessToken.VideoGrant;
var cookieParser = require('cookie-parser');

var app = express();
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
app.get("/token", function(request, response) {
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


var port = process.env.PORT || 3000;
app.listen(port, function() {
    console.log("Express server listening on *:" + port);
});