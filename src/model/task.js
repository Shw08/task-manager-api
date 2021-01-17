const mongoose = require('mongoose')
const validator = require('validator')
const taskSchema = new mongoose.Schema({
    description: {
        type: String,
        trim: true,
        required: true,
    },
    complete : {
        type: Boolean,
        default: false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps:true
})
const task= mongoose.model('tasks',taskSchema)


module.exports = task