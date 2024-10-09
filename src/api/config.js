const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    openai_api_key: process.env.OPENAI_API_KEY,
    mongodb_username: process.env.MONGODB_USER,
    mongodb_password: process.env.MONGODB_PASSWORD,
    email_username: process.env.EMAIL_USER,
    email_password: process.env.EMAIL_PASSWORD,
    claryfy_api: process.env.CLARYFY_API
};