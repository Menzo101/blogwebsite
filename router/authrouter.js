const express = require("express")
const { getregistar, postregistar, getlogin, postlogin,logout } = require("../controller/authcontroller")
const { protected, checkuser } = require("../middlewares/protected")
const router = express.Router();

router.get('/registar', checkuser, getregistar)
router.post('/registar',checkuser,postregistar)
router.get('/login', checkuser, getlogin)
router.post('/login', checkuser, postlogin)
router.get("/logout",  protected,logout)



module.exports = router