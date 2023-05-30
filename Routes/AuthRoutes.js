const { register, login } = require('../Controllers/AuthControllers');
const { checkUser, setNotes, deleteNotes, editNotes } = require('../Middlewares/AuthMiddlewares');

const router = require('express').Router();

router.post("/", checkUser)
router.post("/register", register)
router.post("/login", login)
router.post("/post", setNotes)
router.delete("/:id", deleteNotes)
router.post("/edit", editNotes)

module.exports = router;
