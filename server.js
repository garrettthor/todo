const express = require('express')//Loads express module
const app = express()//Creates a faster-to-use variable for the above module
const MongoClient = require('mongodb').MongoClient//Loads mongodb
const PORT = 2121//Establishes listening port for server
require('dotenv').config()//Allows for the .env file to be used for hidden data

let db,//Declaring the variable for the database
    dbConnectionStr = process.env.DB_STRING,//Assigning the string which contsins the login creds from the dotenv
    dbName = 'todo'//Declaring the string that points to our database name

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})//Tells the mongodb modules to use the .connect() method and connect with the database
    .then(client => {//Upon fulfilling the promise
        console.log(`Hey, connected to ${dbName} database`)//Print a succesful connection console log
        db = client.db(dbName)//Assign the property of db of the client object with an argument of our database name to our db variable
    })
    .catch(err =>{//unless an error has occurred
        console.log(err)//then console log the error
    })

app.set('view engine', 'ejs')//Sets express to use ejs to be viewed in the DOM
app.use(express.static('public'))//Points to our public directory that will contain js and css files that the index.ejs will  link to and use
app.use(express.urlencoded({extended: true}))//I DON'T KNOW
app.use(express.json())//Tells express to format data in JSON objects

app.get('/', async (req, res) => {
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft})

    //PYRAMID OF DOOM BELOW.  BETTER CODE ABOVE.  LEARN IT LIVE IT LOVE IT.
    //
    //db.collection('todos').find().toArray()
    //.then(data => {
    //    db.collection('todos').coundDocuments({completed: false})
    //    .then(itemsLeft => {
    //        res.render('index.ejs', {zebra: data, left: itemsLeft})
    //    })    
    //})
})

app.post('/createTodo', (req, res) => {
    console.log(req.body.todoItem)
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo has been added!')
        res.redirect('/')
    })
})

app.delete('/deleteTodo', (req, res) => {
    console.log(`We out here trying to delete ${req.body.rainbowUnicorn}`)
    db.collection('todos').deleteOne({todo: req.body.rainbowUnicorn})
    .then(result => {
        console.log('Deleted Todo')
        res.json('Deleted It')
    })
    .catch( err => console.log(err))
})

app.put('/markComplete', (req, res) => {
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: true
        }
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})

app.put('/undo', (req, res) => {
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn}, {
        $set: {
            completed: false
        }
    })
    .then(result => {
        console.log('Marked Complete')
        res.json('Marked Complete')
    })
})


app.listen(process.env.PORT || PORT, ()=>{
    console.log('Server is running, you better catch it!')
})
