const mongoose = require("mongoose")

const blogschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    author: {
        type: String,
        required: true
    },
    snippet: {
        type: String,
        required: true,

    },

    completed: {
        type: Boolean,
        default: false
    },
    body: {
        type: String,
        required: true,

    },
  
    
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Blog", blogschema);



