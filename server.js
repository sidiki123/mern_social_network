const express = require('express');
const userRoutes = require('./routes/user.routes');
const postRoutes = require('./routes/post.routes');
const bodyParser = require('body-parser')
require('dotenv').config({path:'./config/.env'});
require('./config/db');
const {checkUser, requireAuth} = require('./middlewares/auth.middleware');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser')
const port = process.env.PORT;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser())

// Authoriser un seul site à faire des requetes à notre API
const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }
app.use(cors(corsOptions));

// Authoriser tout le monde à faire des requetes à notre API
// app.use(cors())

// Début middleware
app.get('*', checkUser);
app.get('/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id)
});
// Fin middleware

// Début routes
app.use('/api/user', userRoutes);
app.use('/api/post', postRoutes);
// Fin routes


// Début serveur
app.listen(port, () => {
    console.log(`Application lancée sur le port ${port}`);
})
// Fin serveur