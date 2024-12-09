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
        const images = req.files?.images
        if (!req.files.images) {
            return res.render("create", { error: "please upload images " })
        }
        if (!Array.isArray(images)) {
            return res.render("create", { error: "please upload more than i image" })
        }
        if (images.length < 2) {
            return res.render("create", { error: "picture upload should be 2" })
        }
        const filesize = 0;
        const allowedExtension = /jpg|png|jpegs/
        for (const img of images) {
            const fileName = img.name
            const fileExt = fileName.split(".").pop();
            const lowerExt = fileExt.tolowercase()
            if (!allowedExtension.test(lowerExt)) {
                return res.render("create", { error: "invalid image format" })
            }
            filesize += img.size
        }
        const maxsize = 1024 * 1024 * 20
        if (filesize > maxsize) {
            return res.render("create", { error: "File size should not be more than 20mb" })
        }
        const filepath = path.join(__dirname, '../public', "uploads")
        if (!fs.existsSync(filepath)) {
            fs.mkdirSync(filepath)
        }
        const imageArray = await promise.all(
            images.map(async (img) => {
                const unique = generateuniqueimage(img.name)
                const filepaths = path.join(filepath, unique);
                await img.mv(filepaths, (err) => {
                    if (err) {
                        return res.render("createproduct", { error: "error occured while uploading" + img.name })
                    }
                })
                return `/uploads/${unique}`
            })
        )
        const { title, snippet, body } = req.body
        await blogmodel.create({
            title: title,
            snippet: snippet,
            body: body,
            images: imageArray,
            displayimage: imageArray[0],
            postedBy: user._id
        })
        return res.redirect("/blogs")
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