require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const usersRoutes = require('./controllers/users')
const departmentsRoutes = require('./controllers/departments')
const employeesRoutes = require('./controllers/employees')


const app = express()
app.use(express.json())
app.use(cors());
app.use('/content', express.static('content/'))
app.use(express.static(__dirname + '/client/build'))
app.use('/api/users', usersRoutes)
app.use('/api/departments', departmentsRoutes)     
app.use('/api/employees', employeesRoutes)


mongoose.connect(process.env.MONGODB_CONNECTION_URI).then(() => {
    console.log('database connected succesfully')
}).catch(error => {
    console.log(error)
})


app.all('*', (req, res) => {
    res.sendFile(__dirname + '/client/build/index.html')
});

app.use((err,req, res, next) => {
    if(err)
     res.status(400).json({error: err.message})
    else
     next()
})

app.listen(process.env.PORT || 5000 , function () {
    console.log('server is listening at 5000')
})