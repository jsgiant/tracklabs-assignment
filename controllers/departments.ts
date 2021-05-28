import { Request, Response } from "express";
import { validationResult } from "express-validator";

import { db } from "../utils/dbUtils";
import { log } from "../utils/logUtils";

export const getDepartments = (req: Request, res: Response) => {
	db.query("SELECT * FROM departments", (error, result) => {
		if (error) {
			return res.status(400).json({ error: "Error while getting departments" });
		}
		const { rows } = result;
		log(`Got all departments info`);
		return res.status(200).json(rows);
	});
};

export const addDepartment = (request: Request, response: Response) => {
	const errors = validationResult(request);

	if (!errors.isEmpty()) {
		return response.status(422).json({ error: errors.array()[0] });
	}

	const { name } = request.body;
	db.query(
		"INSERT INTO departments (name,created_on) VALUES ($1, $2) RETURNING *",
		[name, new Date()],
		(error, result) => {
			if (error) {
				return response
					.status(400)
					.json({ error: "Error while creating department" });
			}
			const { id } = result.rows[0];
			log(`Department is created with id ${id}`);
			return response.status(201).json({ id });
		}
	);
};

export const deleteDepartment = (req: Request, res: Response) => {
	const {
		params: { id },
	} = req;
	db.query("DELETE FROM departments WHERE id=$1", [id], (error, result) => {
		if (error) {
			return res.status(400).json({ error: "Unable to delete department" });
		}
		log(`Department with id ${id} is deleted`);
		return res.status(200).json();
	});
};
