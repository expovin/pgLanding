var OAuth = require('oauth');
var microsoftGraph = require("@microsoft/microsoft-graph-client");
var settings = require('./settings');

var config = {
    o365: settings.O365Auth
};



function getUserEmail(token, callback) {
  // Create a Graph client
  var client = microsoftGraph.Client.init({
    authProvider: (done) => {
      // Just return the token
      done(null, token);
    }
  });

  // Get the Graph /Me endpoint to get user email address
  client
    .api('/me')
    .get((err, res) => {
      if (err) {
        callback(err, null);
      } else {
          callback(null, res);
      }
    });
}

function tokenReceived(response, error, token) {
  if (error) {
    console.log('Access token error: ', error.message);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<p>ERROR: ' + error + '</p>');
    response.end();
  } else {
    getUserEmail(token, function(error, email) {
      if (error) {
        response.write('<p>ERROR: ' + error + '</p>');
        response.end();
      } else if (email) {
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('<p>Email: ' + email + '</p>');
        response.write('<p>Access token: ' + token.token.access_token + '</p>');
        response.end();
      }
    });
  }
}



function processLogin( req, res ) {
    // The application registration (must match Azure AD config)
    var credentials = config.o365;
    var url = credentials.authority+credentials.authorize_endpoint +"?response_type=code&client_id="+credentials.client_id+"&redirect_uri="+credentials.redirect_uri+"&scope="+credentials.scope+"&response_mode=query&nonce="+_guid()+"&state="+req.query.userId;
    //return(url);
    return(url);
    //res.redirect(url);
}

function processAuthorize( req, res ) {
    return new Promise ( function (fulfill, reject ){
        if ( req.query.code !== undefined && req.query.state !== undefined ) {
            //console.log("slack user ID : ",req.query.state);
            _getTokenFromCode( req.query.code, req.query.state, function ( e, accessToken, refreshToken ) {
                if ( e === null ) {
                    getUserEmail(accessToken, function (err, userDet){
                        if(err) reject(err);

                        userDet['UserId']=req.query.state;
                        fulfill(userDet)
                        
                    });
                } else {
                    reject( {"success": false, "error": e} );
                }
            });
        } else {
            reject({"success": false, "message": "missing code"});
        }
    })
};

function processRefreshToken( req, res ) {
    if ( req.query.refresh_token !== undefined ) {
        _getTokenFromRefreshToken( req.query.refresh_token, function ( e, accessToken ) {
            if ( accessToken ) {
                res.status(200).json({ "success": true, "access_token": accessToken } );

            } else {
                res.status(500).json( {"success": false, "error": e} );
            }
        });
    } else {
        res.status(500).json({"success": false, "message": "missing refresh_token"});
    }
};

function processLogout( req, res ) {
    res.status(200).json( {
        'success': true
    } );
}

/**
 * Gets a token for a given resource.
 * @param {string} code An authorization code returned from a client.
 * @param {AcquireTokenCallback} callback The callback function.
 */
function _getTokenFromCode( code, state, callback ) {

    var credentials = config.o365;
    var OAuth2 = OAuth.OAuth2;
    var oauth2 = new OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.authority,
        credentials.authorize_endpoint,
        credentials.token_endpoint
    );

    oauth2.getOAuthAccessToken(
        code,
        {
            grant_type: 'authorization_code',
            redirect_uri: credentials.redirect_uri,
            response_mode: 'form_post',
            nonce: _guid(),
            state: state
        },
        function (e, accessToken, refreshToken) {
            callback(e, accessToken, refreshToken);
        }
    );
}

/**
 * Gets a new access token via a previously issued refresh token.
 * @param {string} refreshToken A refresh token returned in a token response
 *                       from a previous result of an authentication flow.
 * @param {AcquireTokenCallback} callback The callback function.
 */
function _getTokenFromRefreshToken( refreshToken, callback ) {
    var OAuth2 = OAuth.OAuth2;
    var credentials = config.o365;

    var oauth2 = new OAuth2(
        credentials.client_id,
        credentials.client_secret,
        credentials.authority,
        credentials.authorize_endpoint,
        credentials.token_endpoint
    );

    oauth2.getOAuthAccessToken(
        refreshToken,
        {
            grant_type: 'refresh_token',
            redirect_uri: credentials.redirect_uri,
            response_mode: 'form_post',
            nonce: _guid(),
            state: 'practize1234abcde'
        },
        function ( e, accessToken ) {
            callback(e, accessToken);
        }
    );
}

function _guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

exports.processLogin = processLogin;
exports.processAuthorize = processAuthorize;
exports.processRefreshToken = processRefreshToken;
exports.processLogout = processLogout;