const express = require('express');
const expessLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport');

const app = express();

//passport config
require('./config/passport') (passport);

//DB Config
const db = require('./config/keys').MongiURI;

//connect to mongo
mongoose.connect(db, {useNewUrlParser: true})
.then(() => console.log('MongoDB Connected...'))
.catch(err => console.log(err))

//EJS
app.use(expessLayouts)
app.set('view engine', 'ejs')

//BodyParser
app.use(express.urlencoded({extended:false}));

//Express Session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,

}));


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());


//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next()
})

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`server started on port ${PORT}`));