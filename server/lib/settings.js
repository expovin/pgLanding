const os = require('os');

var HostName = 'https://'+os.hostname;

module.exports = {

    TokenExpirees : 3600,
    secret : "%DMX5@&MW5*caDiGU$$S7D5bGHL#w^FCX5Wap9VJYtr7",
    QIX : {
        host: 'pbgameqix.expovin.it',
        port: 4747,
        QRSPort : 4242,
        ProxyPort: 4243,
        userDir : 'EC2AMAZ-L9N9VC9',
        userName: 'ptw',
        certsPath : '../certs',
        proxyTketPath : "/pbg/qps/pbg/ticket?xrfkey=",
        MABAppId : "1f93f120-15c0-436a-a06b-1f9a8d94d376",
        POTAppId : ""
    },    

    O365Auth : {
        authority: "https://login.microsoftonline.com/common",
        authorize_endpoint: "/oauth2/v2.0/authorize",
        token_endpoint: "/oauth2/v2.0/token",
        client_id:"ad3a107b-6ea0-4ac3-984d-6abd0cc81262",
        client_secret : "retP06^@ehlaRAECIC709=}",
        //redirect_uri: "https://itmil-ves/api/v1/users/auth/return", //Redirect URL for Oauth2
        redirect_uri: HostName+"/api/v1/users/auth/return",
        responseType: 'code id_token', 
        responseMode: 'form_post', 
        allowHttpForRedirectUrl: true,
        scope: "user.read offline_access"
    }
}