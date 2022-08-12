const express = require('express');
const path = require('path')
const dotenv = require('dotenv');
const { removeAllListeners } = require('nodemon');
const exphbs = require('express-handlebars');
const connectDB = require('./config/db');
const morgan = require('morgan');


//load config
dotenv.config({path: './config/config.env'});

connectDB();

const app = express();

//logging if in dev mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//view engine is handlbars
app.engine('.hbs', exphbs.engine({ 
    defaultLayout: 'main', 
    extname: '.hbs'}));
app.set('view engine', '.hbs')

//static folder
app.use(express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/index'))
const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on ${PORT}`))

