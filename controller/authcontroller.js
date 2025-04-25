const { registarvalidate, loginvalidate, fgtpassword, otpverify, rstpassword } = require("../middlewares/validate");
const accountmodel = require("../model/accountmodel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { mailsending, generateToken } = require("../middlewares/emailverify");

const getregistar = async (req, res) => {
    try {
        res.render("registar")
    } catch (error) {
        console.log(error.message)
        return res.render("registar")
    }
}
const postregistar = async (req, res) => {
    try {
        const { error } = registarvalidate(req.body);
        if (error) {
            return res.render("registar", { error: error.details[0].message })
        }
        const { firstname, lastname, email, password } = req.body;
        const checkEmail = await accountmodel.findOne({ email: email })
        if (checkEmail) {
            return res.render("registar", { error: "Email already in use" })
        }
        await accountmodel.create({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: password
        })
         res.render('login', {message:"successful"})

    } catch (error) {
        console.log(error.message);
        return res.render("registar", { error: "Error Occured!!" })
    }
}
const getlogin = async (req, res) => {
    try {
        return res.render("login")
    } catch (error) {
        console.log(error.message)
        return res.render("login", { error: "An Error Occured!!" })
    }
}
const postlogin = async (req, res) => {
    try {
        const { error } = loginvalidate(req.body);
        if (error) {
            return res.render("login", { error: error.details[0].message })
        }
        const { email, password } = req.body
        const checkEmail = await accountmodel.findOne({ email: email })
        if (!checkEmail) {
            return res.render("login", { error: "incorrect email/password" })
        }
        const ismatch = await bcrypt.compare(password, checkEmail.password)
        if (!ismatch) {
            return res.render("login", { error: "password/email mismatch" })
        }
        const token =  jwt.sign({ userid: checkEmail._id }, process.env.SECRETPIN, { expiresIn: "1d" })
        res.cookie("blog", token, { expiresIn:"3h", httpOnly:true})
         return res.redirect("/")
    } catch (error) {
        console.log(error.message)
        return res.render("login", { error: "An Error Occured !!" })
    }
}
const forgetpassword = async (req, res) => {
    try {
        const { error } = fgtpassword(req.body)
        if (error) {
            return res.render("forgetpassword", { error: error.details[0].message })
        }
        const { email } = req.body;
        const account = await accountmodel.findOne({ email: email });
        if (!account) {
            return res.render("forgetpassword", { error: "No User Found" })
        }
        let date = new Date()
        date.setMinutes(date.getMinutes() + 15)
        const token = await generateToken()
        const options = {
            from: "do-nosendback@gmail.com",
            to: req.body.email,
            subject: "password reset",
            message: "An Otp pin have been sent to you expires in 15 minutes",
        }
        await mailsending(options);
        account.token = token;
        account.tokenExpiresIn = date
        await account.save()
        res.redirect("/resetpassword")
    } catch (error) {
        console.log(error.message)
        return res.render("forgetpassword")
    }
}
const verifyotp = async (req, res) => {
    try {
        const { error } = otpverify(req.body)
        if (error) {
            return res.render("otp", { error: error.details[0].message });
        }
        const { otp } = req.body;
        const account = await accountmodel.findOne({ token: otp })
        if (!account) {
            return res.render("otp", { error: "Bad Request" })
        };
        if (new Date() > account.tokenExpiresIn) {
            account.token = null
            account.tokenExpiresIn = null
            return res.render("otp", { error: "Bad Request" })
        }
        account.otpverify = true
        await account.save()
        res.redirect("/resetpassword?message=Successful")
    } catch (error) {
        console.log(error.message);
        return res.render("otp", { error: "Bad Request" })
    }
}
const resetpassword = async (req, res) => {
    try {
        const { error } = rstpassword(req.body)
        if (error) {
            return res.render("resetpassword", { error: error.details[0].message })
        }
        const { newpassword, confirmpassword } = req.body
        const account = await accountmodel.findOne({ token: otp })
        if (!account) {
            return res.render("resetpassword", { error: "Bad Request" })
        }
        if (new Date() > account.tokenExpiresIn) {
            account.token = null,
                account.tokenExpiresIn = null
            return res.render("resetpassword", { error: "Bad Request" })
        }
        if (newpassword !== confirmpassword) {
            return res.render("resetpassword", { error: "newpassword/confirmpassword mismatch" })
        }
        account.password = newpassword
        account.token = null
        account.tokenExpiresIn = null
        account.otpverify = false
        await account.save()
        return res.redirect('/blogs')
    } catch (error) {
        console.log(error.message)
        return res.render("resetpassword", { error: "Error Occured !!" })
    }
}

const logout = async(req,res)=>{
    try {
        await  res.clearCookie("blog")
        res.redirect("/login")
    } catch (error) {
        console.log(error.message)
        return res.redirect("/login")
    }
}
module.exports = { getregistar, postregistar, getlogin, postlogin, forgetpassword, verifyotp, resetpassword,logout }