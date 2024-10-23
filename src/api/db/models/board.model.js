const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    _ownerId: {

        type: mongoose.Types.ObjectId,
        required: true
        
    },
    users: [{
        _userId: {
            type: mongoose.Types.ObjectId,
            required: true
        },
    }]
})

BoardSchema.methods.addUser = function(userId) {
    return new Promise((resolve, reject) => {
        let user = this;
        user.users.push({ '_userId': userId});
        user.save().then((user) => {
            if(user) resolve(user);
            else(reject())
        })
    })

}

const Board = mongoose.model('Board', BoardSchema);

module.exports = { Board }