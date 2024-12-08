const nodemailer = require("nodemailer")
const { v4: uuidv4 } = require("uuid")
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
    service: 'gmail', // e.g., Gmail, Yahoo, etc.
    secure: true,
    auth: {
        user: process.env.EMAILADDRESS,
        pass: process.env.EMAILPASSWORD // your email password
    }
});

// Setup email data

function mailsending(options) {
    const mailOptions = {
        from: options.from, // sender address
        to: options.email,// list of receivers
        subject: options.subject, // Subject line
        text: options.message, // plain text body
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log("error sending mail", err)
            return { response: false }
        } else {
            console.log("email sent successfully", info.response)
            return { response: true }
        }
    })

}
async function generateToken() {
    const characters = "ABCEEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    // function to create a random character from the character string
    const generateRandomCharacter = () => {
        const randomindex = Math.floor(Math.random() * characters.length)
        return characters[randomindex]
    };
    //  function to generate a random 6-character part
    const generateRandomPart = () => {
        let randompart = "";
        for (let i = 0; i < 6; i++) {
            randompart += generateRandomCharacter();
        }
        return randompart
    };
    let token;
    let exists = true;
    while (exists) {
        token = generateRandomPart();
        // check if the generated token already exist in the database
        const count = await usermodel.countDocuments({ token: token })
        if (count === 0) {
            exists = false
        }
        return token;
    }
};
module.exports = { mailsending, generateToken }