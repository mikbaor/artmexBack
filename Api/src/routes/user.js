const { Router } = require("express");
const {
  createUser,
  getAllUsers,
  updateUser,
  userById,
  deleteUser,
  filterUser,
  loginUser,
  auth,
  csvUsers,
  updatePermissionUser

} = require("../controllers/userController");
const router = Router();

//gets
router.get("/all", auth, getAllUsers);
router.get("/search/:id",auth, userById);

//posts
router.post("/register",createUser);
router.post("/login",loginUser)
router.post("/filter",auth, filterUser);

//puts
router.post("/update/:id",auth, updateUser);

//delete
router.delete("/delete/:id",auth, deleteUser);

router.post("/csv",auth, csvUsers)

router.post("/updpermission/:id",auth, updatePermissionUser)


module.exports = router;
