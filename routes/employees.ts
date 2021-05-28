import express from "express";

const router = express.Router();
import {
	getEmployees,
	getEmployee,
	addEmployee,
	updateEmployee,
	deleteEmployee,
	sortEmployees,
	searchEmployees,
} from "./../controllers/employees";

router.get("/employees", getEmployees);
router.get("/employees/:id", getEmployee);
router.post("/employees", addEmployee);
router.put("/employees/:id", updateEmployee);
router.delete("/employees/:id", deleteEmployee);
router.post("/employees/sort", sortEmployees);
router.post("/employees/search", searchEmployees);

module.exports = router;
