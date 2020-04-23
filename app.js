var express = require('express')
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
var connectionString = "mongodb://localhost:27017/employeedb";
var app = express()
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('employeedb')
    const employeesCollection = db.collection('employees')
    const todosCollection = db.collection('todos')
    app.get('/', function (req, res) {
        
        db.collection('employees').find().toArray()
        .then(results => {
            var employees = results;
            db.collection('todos').find().toArray()
            .then(results => {
              var todos = results;
              res.render('index.ejs', { employees: employees, todos: todos })
            }).catch(console.error)
        }).catch(console.error)      
    })
    app.get('/add_employee', function (req, res) {
     res.sendFile(__dirname + '/add_employee.html')
    })
    app.get('/add_todo', function (req, res) {
     res.sendFile(__dirname + '/add_todo.html')
    })
    app.post('/add_employee', function (req, res) {
        employeesCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
    app.post('/add_todo', function (req, res) {
        todosCollection.insertOne(req.body)
        .then(result => {
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })
  })
.catch(console.error)

let port = process.env.PORT || 3000;
app.listen(port, function () {
    return console.log("Started server on port " + port);
});