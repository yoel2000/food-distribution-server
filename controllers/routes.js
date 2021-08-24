//var cors = require('cors');

const User = require("../models/user");
const Message = require("../models/message");

let listDistributors = [
    {
    "id": 0,
    "telephone": "05012345",
    "name": "aaa",
    "email": "a.gmail.com"
    },
]


let productsToDistribute = [
    {
    "id": 0,
    "name": "chocolate",
    "date": "23.08.2021",
    "address": "21 Havaad Haleumi, Jerusalem"
    },
]


module.exports = function (app, passport) {

    // normal routes ===============================================================
    // app.use(cors());
    // // const corsOptions = { origin: "http://localhost:3000"}
    // var whitelist = ['http://localhost:3000', 'http://localhost:8080']
    // var corsOptions = {
    //     origin: function (origin, callback) {
    //         if (whitelist.indexOf(origin) !== -1) {
    //             callback(null, true)
    //         } else {
    //             callback(new Error('Not allowed by CORS'))
    //         }
    //     }
    // }

    // show the home page (will also have our login links)
    /*app.get('/', function(req, res) {
        res.render('index.ejs');
    });*/



    // LOGOUT ==============================
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });

    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // locally --------------------------------
    // LOGIN ===============================
    // show the login form
    app.get('/login', function (req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/addDistributor', function(req, res)
    {
        let obj = {...req.body, id:listDistributors.length}
        listDistributors.push(obj)
        console.log(listDistributors)
        res.json(listDistributors)
    });

    app.get('/distributors', function(req, res) {
        res.json(listDistributors)
    });

    app.put('/distributors/:id', function(req, res) {
        let index = listDistributors.findIndex(x => x.id == req.params.id)
        if (index > -1)
            listDistributors[index] = req.body;
        res.json(listDistributors)
    })

    app.post('/addProduct', function(req, res)
    {
        let obj = {...req.body, id:productsToDistribute.length}
        productsToDistribute.push(obj)
        console.log(productsToDistribute)
        res.json(productsToDistribute)
    });

    app.get('/products', function(req, res) {
        res.json(productsToDistribute)
    });

    app.put('/distributions/:id', function(req, res) {
        let index = productsToDistribute.findIndex(x => x.id == req.params.id)
        if (index > -1)
            productsToDistribute[index] = req.body;
        res.json(productsToDistribute)
    })

    app.get('/messages', (req, res) => {
        Message.find({}, (err, messages) => {
            res.send(messages);
        })
    })
    
    app.post('/messages', (req, res) => {
        var message = new Message(req.body);
        console.log(req.body)
        message.save((err) => {
            if (err)
                sendStatus(500);
            io.emit('message', req.body);
            res.sendStatus(200);
        })
    })
    
    io.on('connection', () => { 
        console.log('a user is connected')
    })


    // process the login form
    app.post('/login1', passport.authenticate('local-login', {
        successRedirect: 'http://localhost:3000/chat', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            if (err) { return next(err); }
            if (!user) { return res.send(400); }
            res.json({user:user})
            // res.status(200).json({user:user});
        })(req, res, next);
    });

    // SIGNUP =================================
    // show the signup form
    app.get('/signup', function (req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: 'http://localhost:3000/chat', // redirect to the secure profile section
        failureRedirect: '/signup', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/signup2', async (req, res) => {

                console.log("I'm here!!!!!!!!!!!!!!!!!!!!!!");

                // if (req.body.username === undefined || req.body.username === null || req.body.username === "")
                //     debug("Missing user to add!!!");
                // else if (req.body.password === undefined || req.body.password === null || req.body.password === "")
                //     debug("Missing password for user to add!!!");
                // else if (req.body.name === undefined || req.body.name === null || req.body.name === "")
                //     debug("Missing name for  userto add!!!");
                // else if (req.body.email === undefined || req.body.email === null || req.body.email === "")
                //     debug("Missing name for  userto add!!!");


                    try {
                        console.log(req.body.email)
                        user = await User.findOne({ 'local.email': req.body.email }).exec();
                    } catch (err) {
                        // console.log(err)
                        debug(`get user for adding failure: ${err}`);
                    }
                    console.log(user)
                    if (user === null)
                        try {
                            var newUser = new User();
                            newUser.local.firstname= req.body.firstname;
                            newUser.local.lastname= req.body.lastname;
                            newUser.local.email    = req.body.email;
                            newUser.local.password = newUser.generateHash(req.body.password);
                            await newUser.save().catch(e=>console.log(e));
                            //await User.CREATE([req.body.name, req.body.username, req.body.password, req.body.email, req.body.admin !== undefined]);
                            debug('User created:' + user);
                            res.sendStatus(200)
                        } catch (err) {
                            console.log(err)
                            debug("Error creating a user: " + err);
                        }
                    else
                        debug('User to be added already exists or checkin user existence failure!');
                }

            //.then(res.redirect('http://localhost:3000/chat'))
    );

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile', 'email'] }));

    // handle the callback after facebook has authenticated the user
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: 'http://localhost:3000/chat',
            failureRedirect: '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/auth/twitter', passport.authenticate('twitter', { scope: 'email' }));

    // handle the callback after twitter has authenticated the user
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect: 'http://localhost:3000/chat',
            failureRedirect: '/'
        }));

    // =============================================================================
    // AUTHORIZE (ALREADY LOGGED IN / CONNECTING OTHER SOCIAL ACCOUNT) =============
    // =============================================================================

    // locally --------------------------------
    app.get('/connect/local', function (req, res) {
        res.render('connect-local.ejs', { message: req.flash('loginMessage') });
    });
    app.post('/connect/local', passport.authenticate('local-signup', {
        successRedirect: '/profile', // redirect to the secure profile section
        failureRedirect: '/connect/local', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    // facebook -------------------------------

    // send to facebook to do the authentication
    app.get('/connect/facebook', passport.authorize('facebook', { scope: ['public_profile', 'email'] }));

    // handle the callback after facebook has authorized the user
    app.get('/connect/facebook/callback',
        passport.authorize('facebook', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // twitter --------------------------------

    // send to twitter to do the authentication
    app.get('/connect/twitter', passport.authorize('twitter', { scope: 'email' }));

    // handle the callback after twitter has authorized the user
    app.get('/connect/twitter/callback',
        passport.authorize('twitter', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));


    // google ---------------------------------

    // send to google to do the authentication
    app.get('/connect/google', passport.authorize('google', { scope: ['profile', 'email'] }));

    // the callback after google has authorized the user
    app.get('/connect/google/callback',
        passport.authorize('google', {
            successRedirect: '/profile',
            failureRedirect: '/'
        }));

    // =============================================================================
    // UNLINK ACCOUNTS =============================================================
    // =============================================================================
    // used to unlink accounts. for social accounts, just remove the token
    // for local account, remove email and password
    // user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function (req, res) {
        var user = req.user;
        user.local.email = undefined;
        user.local.password = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function (req, res) {
        var user = req.user;
        user.facebook.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // twitter --------------------------------
    app.get('/unlink/twitter', isLoggedIn, function (req, res) {
        var user = req.user;
        user.twitter.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });

    // google ---------------------------------
    app.get('/unlink/google', isLoggedIn, function (req, res) {
        var user = req.user;
        user.google.token = undefined;
        user.save(function (err) {
            res.redirect('/profile');
        });
    });


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
