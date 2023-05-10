const { register, login } = require('../Controllers/AuthControllers');
const { checkUser, setNotes, deleteNotes } = require('../Middlewares/AuthMiddlewares');

const router = require('express').Router();

router.post("/", checkUser)
router.post("/register", register)
router.post("/login", login)
router.post("/post", setNotes)
router.delete("/:id", deleteNotes)

module.exports = router;
