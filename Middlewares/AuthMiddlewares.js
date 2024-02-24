require("dotenv").config();
const User = require("../Models/UserModel");
const Note = require("../Models/NoteModel");
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
                const populatedUser = await User.findOne({ _id: decodedToken.id }).populate('notes');
                if (user) res.json({status: true, user: user.email, firstName: user.firstName, lastName: user.lastName, notes: populatedUser.notes})
                else res.json({status: false});
                next();
            }
        })
    } else {
        res.json({ status: false});
        next();
    }
}

module.exports.setNotes = async (req, res, next) => {
  const token = req.cookies.jwt;
  const title = req.body.title;
  const content = req.body.content;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
      const foundUser = await User.findOne({ _id: decodedToken.id });

      // Create a new note document
      const newNote = new Note({
        title,
        content,
      });
      await newNote.save();

      // Update the user's notes array with the note's ObjectId
      foundUser.notes.push(newNote._id);
      await foundUser.save();
        
      // Populate the notes array with the actual note documents
      const populatedUser = await User.findOne({ _id: decodedToken.id }).populate('notes');
      res.json({ notes: populatedUser.notes });
    } catch (err) {
      res.json({ err });
    }
  }
};

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
                const populatedUser = await User.findOne({ _id: decodedToken.id }).populate('notes');
                
                res.json({notes: populatedUser.notes})
                next();
            }
        })
    }
};

module.exports.editNote = (req, res, next) => {
    const token = req.cookies.jwt;
    const {title, content, id} = req.body;
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                res.json({err})
                next();
            } else {
                const updatedNote = await Note.findByIdAndUpdate(id, { title, content }, { new: true });
                
                res.json({status: "updated"})
                next();
            }
        })
    }
}
