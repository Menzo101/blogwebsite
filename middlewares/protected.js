
const accountmodel = require("../model/accountmodel")
const jwt = require("jsonwebtoken");

const protected = async (req, res, next) => {
    try {
        const token = req.cookies?.blog
        if (!token) {
            return res.render("login", { error: "Bad Request" })
        }
        const decode = jwt.verify(token, process.env.SECRETPIN)
       
        const currentuser = await accountmodel.findById(decode.userid).select("-password")
        if (!currentuser) {
            res.clearCookie("blog")
            return res.render("login", { error: "Bad Request Unauthorize user" })
        }
        req.user = currentuser
        next()
    } catch (error) {
        console.log(error.message)
        const token = req.cookies?.blog
        if (!token) {
            res.clearCookie("blog")
        }
        return res.render("login", { error: "Bad Request !!" })
    }
}

const checkuser = async (req, res, next) => {
    try {
        const token = req.cookies?.blog
        if (!token) {
            return next()
        }
        const decode = jwt.verify(token, process.env.SECRETPIN)
        const currentuser = await accountmodel.findById(decode.userid).select("-password")
        if (!accountmodel) {
            res.clearCookie("blog")
            return next()
        }
        req.user = currentuser
        next()
    } catch (error) {
        console.log(error.message)
        const token = req.query?.blog
        if (!token) {
            res.clearCookie("blog")
        }
        return next()
    }
}
module.exports = { protected, checkuser }