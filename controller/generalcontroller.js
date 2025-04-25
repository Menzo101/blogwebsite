const blogmodel = require("../model/blogmodel")
const path = require("path")
const fs = require("fs")

const { generateuniqueimage, productvalidate } = require('../middlewares/validate')
const getblog = async (req, res) => {
    const user = req.user
    let name;
    try {

        if (user?.firstname) {
            name = user?.firstname
        }
        const allblog = await blogmodel.find().sort({ createdAt: -1 }).populate("postedBy")
        return res.render("home", { allblog, user, name })
    } catch (error) {
        console.log(error.message)
        return res.render("home", { error: "An Error Occured !" })
    }
}

const postblog = async (req, res) => {
    const user = req.user
    try {
        const { error } = productvalidate(req.body)
        if (error) {
            return res.render("create", { error: error.details[0].message })
        }
   
        const { title, snippet, body } = req.body
        await blogmodel.create({
            title: title,
            snippet: snippet,
            body: body,

            postedBy: user._id
        })

    
        return res.redirect("/")
    } catch (error) {
        console.log(error.message)
        return res.render("create", { error: "Error Ocurred!!" })
    }
}
const deleteblog = async (req, res) => {
    try {
        const taskid = req.params?.id;
        if (!taskid) {
            return res.render("home", { message: "no such blog found" })
        }
        await blogmodel.findByIdAndDelete(taskid);
        return res.redirect("/create");
    } catch (error) {
        console.log(error.message)
        return res.render("home", { error: "An Error Occured !" })
    }
}
const getblogdetail = async (req, res) => {
    try {
        const productid = req.params?.id
        if (!productid) {
            return res.render("home", { error: "No such blog found" })
        }
        const blogs = await blogmodel.findOne({ _id: productid })
        if (!blogs) {
            return res.redirect("/home")
        }
        res.render("detail", { blogs })


    } catch (error) {
        console.log(error.message)
        return res.render("home", { message: "Error Occured !!" })
    }
}
module.exports = { getblog, postblog, deleteblog, getblogdetail }