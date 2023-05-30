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
                if (user) res.json({status: true, user: user.email, firstName: user.firstName, notes: populatedUser.notes})
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

module.exports.editNotes = async (req, res, next) => {
  const token = req.cookies.jwt;
  const prevNote = req.body.prevNote;
  const newTitle = req.body.title;
  const newContent = req.body.content;
    console.log(prevNote)
    console.log(newTitle)

//   if (token) {
//     try {
//       const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
//       const foundUser = await User.findOne({ _id: decodedToken.id });
        
//       // Find the note document by its ID
//       const foundNote = await Note.findOne({ _id: prevNote.id });

//       if (!foundNote) {
//         return res.status(404).json({ error: 'Note not found' });
//       }
       
//       // Check if the note belongs to the user
//       if (!foundUser.notes.includes(foundNote._id)) {
//         return res.status(403).json({ error: 'Unauthorized to edit this note' });
//       }

//       // Update the note document with the new title and content
//       foundNote.title = newTitle || prevNote.title;
//       foundNote.content = newContent || prevNote.content;
//       await foundNote.save();
        
//       // Populate the notes array with the actual note documents
//       const populatedUser = await User.findOne({ _id: decodedToken.id }).populate('notes');
//       res.json({ notes: populatedUser.notes });
//     } catch (err) {
//       res.json({ err });
//     }
//   }
}
