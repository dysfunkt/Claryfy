//this file will handle connection logic to MongoDB database

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb+srv://dysfunkt:Password123@claryfydb.ejfai.mongodb.net/?retryWrites=true&w=majority&appName=claryfyDB', {}).then(() => {
    console.log("Connected to MongoDB successfully");
}).catch((e) => {
    console.log("error while attempting to connect to MongoDB");
    console.log(e);
});

module.exports = {
    mongoose
};