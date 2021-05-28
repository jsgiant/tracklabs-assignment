import fs from "fs";
import path from "path";

const getFileName = () => {
	const now = new Date();
	const name =
		now.getDate().toString() +
		"-" +
		now.getMonth().toString() +
		"-" +
		now.getFullYear().toString();
	return name + ".txt";
};

const isFileExists = (filePath: string) => {
	if (fs.existsSync(filePath)) {
		return true;
	}
	return false;
};

export const log = async (message: string) => {
	const fileName = getFileName();
	const filePath = path.resolve(`../trakinvest/logs/${fileName}`);
	let isFileCreatedNow = false;
	if (!isFileExists(filePath)) {
		isFileCreatedNow = true;
		await fs.open(filePath, "w", (err, file) => {
			if (err) {
				throw err;
			}
			console.log("Log file is created.");
		});
	}
	const logMessage = isFileCreatedNow ? message : `\n${message}`;
	fs.appendFile(filePath, logMessage, (err) => {
		if (err) {
			throw err;
		}
		console.log("Log saved!");
	});
};
