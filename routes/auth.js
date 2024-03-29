const User = require('../Models/User');
const CryptoJS = require("crypto-js");
const jwt = require('jsonwebtoken');

const router = require('express').Router()

//user register...
router.post('/register', async (req, res) => {

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SECRET).toString(),
    });

    try {
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
        console.log(savedUser);
    } catch (err) {
        res.status(400).json(err)
        console.log(err);
    }
})

// login ...
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        !user && res.status(401).json('wrong credintial')
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password && res.status(401).json('wrong credintial');

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" },

        )
        const { password, ...others } = user._doc;
        res.status(200).json({...others, accessToken})
    } catch (err) {
        res.status(500).json(err)
        console.log(err);
    }
})
module.exports = router;