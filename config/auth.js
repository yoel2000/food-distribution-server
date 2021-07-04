module.exports = {

    'facebookAuth' : {
        'clientID'      : '125794702918753', // your App ID
        'clientSecret'  : '3a76b1b3d927d8b22909774e5ceb3a85', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name'] // For requesting permissions from Facebook API
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '620423120607-n6kka76pqrf5mahfc8bcd25j4jmh5r0l.apps.googleusercontent.com',
        'clientSecret'  : 'Xn5Z4838nFz0ZvJtHS-XM7vq',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};