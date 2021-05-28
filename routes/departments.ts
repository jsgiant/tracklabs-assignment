import express from "express";

const router = express.Router();
import {
	addDepartment,
	deleteDepartment,
	getDepartments,
} from "./../controllers/departments";

router.get("/departments", getDepartments);
router.post("/departments", addDepartment);
router.delete("/departments/:id", deleteDepartment);

module.exports = router;
