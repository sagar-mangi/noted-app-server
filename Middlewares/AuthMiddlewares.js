require("dotenv").config();
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({status: false});
                next();
            } else {
                const user = await User.findById(decodedToken.id)
                if (user) res.json({status: true, user: user.email, firstName: user.firstName, notes: user.notes})
                else res.json({status: false});
                next();
            }
        })
    } else {
        res.json({ status: false});
        next();
    }
}

module.exports.setNotes = (req, res, next) => {
    const token = req.cookies.jwt;
    const title = req.body.title;
    const content = req.body.content;

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({err})
                next();
            } else {
                let foundUser = await User.findOne({_id: decodedToken.id})
                foundUser.notes.push({title, content})
//                 await foundUser.save();
                res.json({notes: foundUser.notes})
                next();
            }
        })
    }
}

module.exports.deleteNotes = (req, res, next) => {
    const token = req.cookies.jwt;
    const id = req.params.id;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({err})
                next();
            } else {
                const foundUser = await User.findOne({_id: decodedToken.id})
                foundUser.notes.pull(id)
                await foundUser.save()
                res.json({notes: foundUser.notes})
                next();
            }
        })
    }
}
