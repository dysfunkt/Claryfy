const mongoose = require('mongoose');

const TaskCardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _columnId: {
        type: mongoose.Types.ObjectId,
        required: true
    }, 
    position: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        default: '',

    }

})

const TaskCard = mongoose.model('TaskCard', TaskCardSchema);

module.exports = { TaskCard }