const skmeans = require("skmeans");
const User = require("../models/user");
const Message = require("../models/message");
const distribution = require("../models/distribution");
const product = require("../models/product");
const user = require("../models/user");

let listDistributors = [
    {
        "id": 0,
        "telephone": "05012345",
        "name": "aaa",
        "email": "a.gmail.com"
    },
    {
        "id": 1,
        "telephone": "05054321",
        "name": "David",
        "email": "david.gmail.com"
    },
    {
        "id": 2,
        "telephone": "05056789",
        "name": "Avraham",
        "email": "avraham.gmail.com"
    },
]


let productsToDistribute = [
    {
        "name": "chocolate",
        "date": "2021-08-31",
        "address": "Jérusalem",
        "id": 0,
    },
    {
        "name": "milk",
        "date": "2021-08-31",
        "address": "Tel Aviv",
        "id": 1,
    },
    {
        "name": "boyom",
        "date": "2021-08-31",
        "address": "havaad haleumi",
        "id": 2,
    },
    {
        "name": "boyom",
        "date": "2021-08-31",
        "address": "Ashkelon",
        "id": 3,
    },
    {
        "name": "a",
        "date": "2021-08-31",
        "address": "בית שמש",
        "id": 4,
    },
    {
        "name": "b",
        "date": "2021-09-01",
        "address": "Bakka",
        "id": 5,
    },
    {
        "name": "c",
        "date": "2021-08-31",
        "address": "Beer Sheva",
        "id": 6,
    },
    {
        "name": "d",
        "date": "2021-08-31",
        "address": "Haifa",
        "id": 7,
    },
]


module.exports = function (app, passport, io) {

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

    app.put('/addDistributor', function (req, res) {
        let obj = {
            ...req.body, id: listDistributors.length
        }
    });
    app.post('/addDistributor', function (req, res) {
        let obj = { ...req.body, id: listDistributors.length }
        listDistributors.push(obj)
        console.log(listDistributors)
        res.json(listDistributors)
    });

    app.get('/distributors', function (req, res) {
        res.json(listDistributors)
    });

    app.put('/distributors/:id', function (req, res) {
        let index = listDistributors.findIndex(x => x.id == req.params.id)
        if (index > -1)
            listDistributors[index] = req.body;
        res.json(listDistributors)
    })

    app.put('/distributors2/:id', async function (req, res) {
        await distribution.findByIdAndUpdate(req.params.id, req.body)
        let list = await distribution.find({});
        res.json(list)
    })

    app.post('/distributions', async (req, res) => {
        var dist = new distribution(req.body);
        dist.save((err) => {
            if (err)
                res.sendStatus(500);;
        })
        let list = await distribution.find({})
        res.json(list);
    })

    app.get('/distributions', async (req, res) => {
        let list = await distribution.find({})
        res.json(list);
    })

    app.post('/distributions/at/', async (req, res) => {
        let list = await distribution.find({})
        let date = req.body.date;
        let cityList = req.body.cityList;
        let filteredList = list.filter(x => (x.date == date && cityList.includes(x.city)))
        let obj= {};
        cityList.forEach(x=>{
            obj[x]=[];
        })
        filteredList.forEach(x=>{
            obj[x.city].push(x)
        })
        res.json(obj);
    })

    app.post('/distributions/between/', async (req, res) => {
        let list = await distribution.find({})
        let date1 = req.body.date1;
        let date2 = req.body.date2;
        let cityList = req.body.cityList;
        let filteredList = list.filter(x => (x.date >= date1 && x.date <= date2 && cityList.includes(x.city)))
        let obj= {};
        cityList.forEach(x=>{
            obj[x]=[];
        })
        filteredList.forEach(x=>{
            obj[x.city].push(x)
        })
        res.json(obj);
    })

    app.post('/addProduct', function (req, res) {
        let obj = { ...req.body, id: productsToDistribute.length }
        productsToDistribute.push(obj)
        console.log(productsToDistribute)
        res.json(productsToDistribute)
    });

    app.put('/addProduct', function (req, res) {
        let obj = { ...req.body, id: productsToDistribute.length }
    });

    app.post('/addProduct', function (req, res) {
        let obj = { ...req.body, id: productsToDistribute.length }
        productsToDistribute.push(obj)
        console.log(productsToDistribute)
        res.json(productsToDistribute)
    });

    app.get('/products', function (req, res) {
        res.json(productsToDistribute)
    });

    app.get('/products2', async function (req, res) {
        let list = await product.find({});
        res.json(list)
    });

    app.post('/products', async function (req, res) {
        console.log(req.body.name)
        var p = new product(req.body);
        p.save((err) => {
            if (err)
                res.sendStatus(500);;
        })
        let list = await product.find({})
        res.json(list);
    });

    app.put('/distributions/:id', function (req, res) {
        let index = productsToDistribute.findIndex(x => x.id == req.params.id)
        if (index > -1)
            productsToDistribute[index] = req.body;
        res.json(productsToDistribute)
    })

    app.get('/messages', (req, res) => {
        Message.find({}, (err, messages) => {
            console.log(messages)
            res.json(messages);
        })
    });

    app.get('/deliveriestoday', function (req, res) {
        date = new Date();
        date = date.toISOString().split('T')[0];
        newDeliver = []
        productsToDistribute.map((p) => {
            values = Object.values(p);
            if ((values[1] === date)) {
                newDeliver = [...newDeliver, values];
            }
        })
        res.json(newDeliver);
    });

    app.get('/deliveriestoday2', async function (req, res) {
        date = new Date();
        console.log(date);

        let distributions = await distribution.find({});
        let filteredList = distributions.filter(x => x.date.setHours(0, 0, 0, 0) == date.setHours(0, 0, 0, 0))
        res.json(filteredList);
    });

    app.post('/dispatch', function (req, res) {
        data = []
        for (let i = 0; i < req.body.latitude.length; i++) {
            data = [...data, [req.body.latitude[i], req.body.longitude[i]]]
        }
        const k = req.body.dividersList.length;
        results = skmeans(data, k, "kmpp", 10);
        console.log(results)
        res.json(results)
    })

    app.put('user/:id', async (req, res) => {
        let user = await user.updateOne({ _id: req.params.id }, req.body)
        res.json(user)
    })

    app.get('/messages', (req, res) => {
        Message.find({}, (err, messages) => {
            console.log(messages)
            res.json(messages);
        })
    })

    app.post('/myMessages', (req, res) => {
        console.log("from" + req.body.from)
        console.log("to" + req.body.to)
        if (req.body.to)
            Message.find({ $or: [{ from: req.body.from, to: req.body.to }, { from: req.body.to, to: req.body.from }] }, (err, messages) => {
                if (err) console.log(err)
                console.log(messages.count)
                res.json(messages);
            })
        else {
            Message.find({ $or: [{ from: req.body.from }, { to: req.body.from }] }, (err, messages) => {
                if (err) console.log(err)
                console.log(messages.count)
                res.json(messages);
            })
        }
    })

    app.post('/messages', (req, res) => {
        var message = new Message(req.body);
        console.log(req.body)
        message.save((err) => {
            if (err)
                res.sendStatus(500);
            io.emit('message', req.body);
            res.sendStatus(200);
        })
    })

    io.on('connection', () => {
        console.log('a user is connected')
    })

    app.get('/users', (req, res) => {
        User.find({}, (err, users) => {
            res.json(users);
        })
    })


    // process the login form
    app.post('/login1', passport.authenticate('local-login', {
        successRedirect: 'http://localhost:3000/chat', // redirect to the secure profile section
        failureRedirect: '/login', // redirect back to the signup page if there is an error
        failureFlash: true // allow flash messages
    }));

    app.post('/login', function (req, res, next) {
        passport.authenticate('local-login', function (err, user, info) {
            console.log("gggg")
            if (err) { return next(err); }
            console.log("user-->")

            console.log(user)

            if (!user) { return res.sendStatus(400); }
            res.json({ user: user })
        })(req, res, next);
    });

    // app.post('/login', passport.authenticate('local-login', {
    //     successRedirect : '/profile', // redirect to the secure profile section
    //     failureRedirect : '/login', // redirect back to the signup page if there is an error
    //     failureFlash : true // allow flash messages
    // }));

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
        let user;
        // if (req.body.username === undefined || req.body.username === null || req.body.username === "")
        //     debug("Missing user to add!!!");
        // else if (req.body.password === undefined || req.body.password === null || req.body.password === "")
        //     debug("Missing password for user to add!!!");
        // else if (req.body.name === undefined || req.body.name === null || req.body.name === "")
        //     debug("Missing name for  userto add!!!");
        // else if (req.body.email === undefined || req.body.email === null || req.body.email === "")
        //     debug("Missing name for  userto add!!!");


        try {
            //console.log(req.body.email)
            user = await User.findOne({ 'local.email': req.body.email }).exec();
        } catch (err) {
            console.log(err)
            debug(`get user for adding failure: ${err}`);
        }
        //console.log(user)

        if (user === null) {
            console.log("user is null")
            try {
                var newUser = new User();
                newUser.local.firstname = req.body.firstname;
                newUser.local.lastname = req.body.lastname;
                newUser.local.email = req.body.email;
                newUser.local.password = newUser.generateHash(req.body.password);
                await newUser.save().catch(e => console.log(e));
                //await User.CREATE([req.body.name, req.body.username, req.body.password, req.body.email, req.body.admin !== undefined]);
                //debug('User created:' + newUser);
                res.json({ user: newUser }).sendStatus(200)
            } catch (err) {
                console.log(err)
                //debug("Error creating a user: " + err);
            }
        }
        else {
            console.log("fff")
            //debug('User to be added already exists or checkin user existence failure!');
            res.sendStatus(400)

        }
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

