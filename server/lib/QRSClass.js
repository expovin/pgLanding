const https = require('https');
const fs = require('fs');
const randomstring = require("randomstring");
const settings = require('./settings');
const path = require("path");

class QRS {

    constructor(){

        this.options = {
            hostname : settings.QIX.host,
            port : settings.QIX.QRSPort,
            rejectUnauthorized: false, 
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'X-Qlik-User' : 'UserDirectory=EC2AMAZ-L9N9VC9;UserId=ves'
            },   
            cert: fs.readFileSync(path.resolve(__dirname, "../certs/client.pem")),
            key : fs.readFileSync(path.resolve(__dirname, "../certs/client_key.pem"))         
        }        
    }

    genXrfkey() { return randomstring.generate(16)}

    getToken(trigram){
        let xrfkey=randomstring.generate(16);

        var options = {
            hostname: settings.QIX.host,
            port: settings.QIX.ProxyPort,
            path: settings.QIX.proxyTketPath+xrfkey,
            method: 'POST',
            rejectUnauthorized: false, 
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
                'x-qlik-xrfkey' : xrfkey
            },
            cert: fs.readFileSync(path.resolve(__dirname, "../certs/client.pem")),
            key : fs.readFileSync(path.resolve(__dirname, "../certs/client_key.pem"))  
          };       
          
          var bodyData = {
            UserDirectory : settings.QIX.userDir,
            UserId : trigram
          };       
          
          return new Promise ( (fulfill, reject) =>{
            var req = https.request(options, function(res) {        
                res.on('data', function (body) {
                    console.log(' --------->> Body: ' + body);
                    fulfill(JSON.parse(body));
                });
            });
        
            req.on('error', function(e) {
              reject(e.message);
            });
        
            req.write(JSON.stringify(bodyData));
            req.end();
          })          
    }

}

module.exports = QRS;