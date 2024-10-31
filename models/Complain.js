const mongoose = require('mongoose');

const complainSchema = new mongoose.Schema({
    wastetype: {
        type: String,
        required: false
    },
    comment: {
        type: String,
        required: false
    },
    phoneno: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: false,
        validate: {
            validator: function(v) {
                return /^\S+@\S+\.\S+$/.test(v); // Basic email format validation
            },
            message: props => `${props.value} is not a valid email!`
        }
    },
    address: {
        type: String,
        required: false
    },
    image: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now 
    }
});

const Complain = mongoose.model('Complain', complainSchema);
module.exports = Complain;
