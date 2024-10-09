//this file will handle connection logic to MongoDB database

const mongoose = require('mongoose');
const { mongodb_username, mongodb_password } = require('../config');

mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://${mongodb_username}:${mongodb_password}@claryfydb.ejfai.mongodb.net/?retryWrites=true&w=majority&appName=claryfyDB`, {}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((e) => {
    console.log("error while attempting to connect to MongoDB");
    console.log(e);
});

module.exports = {
    mongoose
};