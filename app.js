const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session')
const MongoStore = require('connect-mongo');
const { removeAllListeners } = require('nodemon');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const morgan = require('morgan');

//load config
dotenv.config({path: './config/config.env'});

//passport config
require('./config/passport')(passport);

connectDB();

const app = express();


//MIDDLEWARE
//body parser
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//logging if in dev mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
};
//helpers
const { formatDate, truncate, stripTags, editIcon, select } = require('./helpers/hbs')

//view engine is handlbars
app.engine('.hbs', exphbs.engine({ 
    helpers: {
        formatDate, 
        truncate,
        stripTags,
        editIcon,
        select
    },
    defaultLayout: 'main', 
    extname: '.hbs'}));
app.set('view engine', '.hbs');

//method override
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//sessions middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
     })
}))
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//an ugly global variable
app.use(function(req, res, next) {
    res.locals.user = req.user || null
    next()
})

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//ROUTES
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/notes', require('./routes/notes'));

//port options
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`))

