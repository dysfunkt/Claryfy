const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    openai_api_key: process.env.OPENAI_API_KEY,
    mongodb_username: process.env.MONGODB_USER,
    mongodb_password: process.env.MONGODB_PASSWORD
};