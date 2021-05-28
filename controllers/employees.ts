import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { db } from "../utils/dbUtils";
import { log } from "../utils/logUtils";

export const getEmployees = (_request: Request, response: Response) => {
	db.query(
		"SELECT * FROM employees ORDER BY id ASC",
		(error: Error, results: any) => {
			if (error) {
				return response
					.status(400)
					.json({ error: "Error while getting employee details" });
			}
			log("Got employees data");
			return response.status(200).json(results.rows);
		}
	);
};

export const getEmployee = (request: Request, response: Response) => {
	const { id } = request.params;
	db.query(
		"SELECT * FROM employees WHERE id = $1",
		[id],
		(error, results: any) => {
			if (error) {
				return response
					.status(400)
					.json({ error: "Error while getting employee details" });
			}
			if (results.rows.length) {
				log("Got selected employee data");
				return response.status(200).json(results.rows[0]);
			} else {
				return response.status(400).json({ error: "Employee not found" });
			}
		}
	);
};

export const addEmployee = (request: Request, response: Response) => {
	const errors = validationResult(request);
	if (!errors.isEmpty()) {
		return response.status(422).json({ error: errors.array()[0] });
	}

	const { name, email, department } = request.body;
	db.query(
		"SELECT * FROM employees WHERE email=$1",
		[email],
		(_error, result) => {
			if (result.rows.length) {
				return response.status(409).json({ error: "Email already exists!" });
			}
			if (department) {
				db.query(
					"SELECT * FROM departments WHERE id=$1",
					[department],
					(error, results) => {
						if (error) {
							return response
								.status(400)
								.json({ error: "Something went wrong.Please try again!" });
						}
						if (!results.rows.length) {
							return response
								.status(400)
								.json({ error: "Department doesn't exist!" });
						}

						db.query(
							"INSERT INTO employees (name,email,department,created_on) VALUES ($1, $2, $3, $4) RETURNING *",
							[name, email, department, new Date()],
							(error, results) => {
								if (error) {
									return response.status(400).json({
										error: "Error while adding employee.Please try again!",
									});
								}
								const { id } = results.rows[0];
								log(`Employee-${id} added successfully!`);
								response.status(201).send({ id });
							}
						);
					}
				);
			}
		}
	);
};
export const updateEmployee = (request: Request, response: Response) => {
	const { id } = request.params;
	const { name, email, department } = request.body;
	if (department) {
		db.query(
			"SELECT * FROM departments WHERE id=$1",
			[department],
			(error, results) => {
				if (error) {
					return response
						.status(400)
						.json({ error: "Something went wrong.Please try again!" });
				}
				if (!results.rows.length) {
					return response
						.status(400)
						.json({ error: "Department doesn't exist!" });
				}
				db.query(
					"UPDATE employees SET name = $1, email = $2,department = $3 WHERE id = $4",
					[name, email, department, id],
					(error: Error) => {
						if (error) {
							return response
								.status(400)
								.json({ error: "Error while updating the employee details" });
						}
						log(`Employee -${id} updated successfully!`);
						response.status(200).send({});
					}
				);
			}
		);
	}
};

export const deleteEmployee = (request: Request, response: Response) => {
	const { id } = request.params;
	db.query(
		"SELECT * FROM employees WHERE id = $1",
		[id],
		(error, results: any) => {
			if (error) {
				return response
					.status(400)
					.json({ error: "Error while getting employee details" });
			}
			if (!results.rows.length) {
				return response.status(400).json({ error: "Employee not found" });
			}
			db.query("DELETE FROM employees WHERE id = $1", [id], (error: Error) => {
				if (error) {
					return response
						.status(400)
						.json({ error: "Error while deleting the employee" });
				}
				log(`Employee-${id} deleted successfully!`);
				return response.status(200).send({});
			});
		}
	);
};

export const sortEmployees = (req: Request, res: Response) => {
	const { sort_by, sort_type } = req.body;
	const query = `SELECT * FROM employees ORDER BY ${sort_by} ${sort_type}`;
	db.query(query, (error, result) => {
		if (error) {
			return res.status(400).json({ error: "Unable to sort employees" });
		}
		const { rows } = result;
		log(`Sorted all employees by ${sort_by} column in ${sort_type} order`);
		return res.status(200).json({ employees: rows });
	});
};

export const searchEmployees = (req: Request, res: Response) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(422).json({ error: errors.array()[0] });
	}

	const { search_term } = req.body;
	const query = "SELECT * FROM employees";
	db.query(query, (error, result) => {
		if (error) {
			return res.status(400).json({ error: "Unable to search employees" });
		}

		const { rows } = result;
		const lowerSearchTerm = search_term.toLowerCase();
		const employees = rows.filter((row) => {
			const { email, first_name, last_name } = row;
			if (
				email.toLowerCase().includes(lowerSearchTerm) ||
				first_name.toLowerCase().includes(lowerSearchTerm) ||
				last_name.toLowerCase().includes(lowerSearchTerm)
			) {
				return true;
			}
		});
		log(`Got employees who match with search term ${search_term}`);
		return res.status(200).json({ employees });
	});
};
