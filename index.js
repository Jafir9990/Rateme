require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const usersRoutes = require('./controllers/users')
const departmentsRoutes = require('./controllers/departments')


const app = express()
app.use(express.json())
app.use(cors());
app.use('/api/users', usersRoutes)
app.use('/api/departments', departmentsRoutes)


mongoose.connect(process.env.MONGODB_CONNECTION_URI).then(() => {
    console.log('database connected succesfully')
}).catch(error => {
    console.log(error)
})

app.get('/test', (req, res) => {
    res.send('testing in our first route')
});

app.all('*', (req, res) => {
    res.send('page Not Fond')
});

app.listen(5000, function () {
    console.log('server is listening at 5000')
})