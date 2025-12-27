const express = require("express");
const router = express.Router();

const {
  addChild,
  getAllChildren,
  updateChild,
  deleteChild
} = require("../controllers/childController");

router.post("/add", addChild);
router.get("/", getAllChildren);
router.put("/:id", updateChild);
router.delete("/:id", deleteChild);

module.exports = router;
