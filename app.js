//import modules
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { Pool } = require('pg') 

const pool = new Pool({
    host: 'localhost',
    user: 'bssa_assignments',
    database: 'bulletinboard',
    port: '5432',
  })

let database;

pool.query('select title, body from messages ORDER BY id desc')
        .then((response) => database = response.rows)
        .catch(err => console.error('Error executing query', err.stack))

//use bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//use static files
app.use(express.static('public'));
app.use(express.static('node_modules/bulma/css'));

//set view enige
app.set("view engine", "ejs");

//viewing the messages
app.get('/messages', (req, res) => {
    pool.query('select title, body from messages ORDER BY id desc')
        .then((response) => database = response.rows)
        .catch(err => console.error('Error executing query', err.stack))

  res.render('messages', {database: database})
})


//posting a message
app.get('/postmessage', (req, res) => {
    res.render('postmessage')
})

app.post('/postmessage', (req, res) => {
    title = req.body.title;
    body = req.body.message;
    pool.query(`insert into messages (title, body) values ('${title}', '${body}')`)
        .then((response) => console.log(`${response.command}: ${response.rowCount}`))
        .catch(err => console.error('Error executing query', err.stack))
    res.redirect('/messages')
})

//listening port
app.listen(3000, () => {
    console.log('Server listening on port 3000!')
})
