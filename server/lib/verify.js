var jwt = require('jsonwebtoken'); 
var settings = require('./settings');

var SECRET = settings.secret;
/** This function return the actual token after the user logged in */
exports.getToken = function (user) {
    return jwt.sign(user, SECRET, {
        expiresIn: settings.TokenExpirees
    });
};

/** This function check if the token is still valid and belong to the ordinary user */
exports.verifyOrdinaryUser = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    // decode token
    if (token) {
        jwt.verify(token, SECRET, function (err, decoded) {
            if (err) {
                var err = {}; //new Error('You are not authenticated!');
                err.status = 401;
                err.success=false;
                err.message="Token verification error.";
                next(err);

            } else {
                console.log("Token verified : ",decoded);
                if((decoded.role === "Ordinary")){
                    req.decoded = decoded;
                    req.user=true;
                    req.process=false;
                    console.log("Ordinary user");
                    next();
                    
                }
                else{
                    req.user=false;
                    req.process=true;    
                    var err = {}; //new Error('Profile does not fit the ordinary user');
                    err.status = 402;
                    err.success=false;
                    err.message="Token verification error.";    
                    next(err);
                    //return res.json({success:false, status:"405",msg:"Profile does not fit the ordinary user"});
                }
            }
        });
    } else {
        var err = new Error('No token provided!');
        err.status = 403;
        console.log("Error Token not provided");
        next(err);
        //return res.json({success:false, status:"403",msg:"No Token Provided"}); //next(err);
    }
};