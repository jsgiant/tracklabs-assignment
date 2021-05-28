import express from "express";
import bodyParser from "body-parser";

const employeeRoutes = require("./routes/employees");
const departmentRoutes = require("./routes/departments");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
);

app.use("/api", employeeRoutes);
app.use("/api", departmentRoutes);

app.listen(port, () => {
	console.log(`App listening at ${port}`);
});
