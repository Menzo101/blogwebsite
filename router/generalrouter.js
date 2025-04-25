const express = require("express");
const { protected, checkuser } = require("../middlewares/protected")
const { getblog, postblog, deleteblog, getblogdetail } = require("../controller/generalcontroller");
const router = express.Router()

router.get('/', checkuser, getblog)
// router.get('/blogs', postblog)
router.post('/blogs', protected, postblog)
router.get('/blogsdetails/:id?', checkuser, getblogdetail)
router.get('/delete/:id?', protected, deleteblog)

module.exports = router




