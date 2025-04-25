const mongoose = require("mongoose")

const blogschema = new mongoose.Schema({
    title: {
        type: String,
        required: true,

    },
    snippet: {
        type: String,
        required: true,

    },
    images: [{
        type: String,
        required: true
    }],
    displayimage: {
        type: String
    },
    completed: {
        type: Boolean,
        default: false
    },
    body: {
        type: String,
        required: true,

    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Blogs", blogschema);



