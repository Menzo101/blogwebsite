const Joi = require("joi");
const { v4: uuidv4 } = require("uuid")

const registarvalidate = (data) => {
    const registarschema = Joi.object({
        firstname: Joi.string(),
        lastname: Joi.string(),
        email: Joi.string().email(),
        password: Joi.string(),
        confrimpassword: Joi.string()

    })
    return registarschema.validate(data)
}
const loginvalidate = (data) => {
    const loginschema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    return loginschema.validate(data)
}
const fgtpassword = (data) => {
    const forgetpasswordschema = Joi.object({
        email: Joi.string().email().required()
    })
    return forgetpasswordschema.validate(data)
}
const otpverify = (data) => {
    const otpverifyschema = Joi.object({
        otp: Joi.string().required()
    })
    return otpverifyschema.validate(data)
}
const rstpassword = (data) => {
    const resetpasswordschema = Joi.object({
        newpassword: Joi.string().required(),
        confirmpassword: Joi.string().required()
    })
    return resetpasswordschema.validate(data)
}
const productvalidate = (data) => {
    const productschema = Joi.object({
        title: Joi.string().required(),
        snippet: Joi.string().required(),
        body: Joi.string().required(),
    })
    return productschema.validate(data)
}

const generateuniqueimage = (name) => {
    const filename = name.split(".").pop()
    const unique = `${uuidv4()}.${filename}`
    return unique

}
module.exports = { registarvalidate, loginvalidate, fgtpassword, otpverify, rstpassword, generateuniqueimage, productvalidate }