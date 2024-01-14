import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";

import connectMongoDB from "../Database/connectMongoDB.js";
import { expressLogger, logger } from "../Core/AppLogger.js";
import { AuthRouter } from "../App/Authentication/Router/AuthRouter.js";
import { ExpenseRouter } from "../App/Expense/Router/ExpenseRouter.js";

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;
connectMongoDB()

app.use(expressLogger)
app.use(bodyParser.json())
app.use(cookieParser());

app.use(process.env.AUTH_BASE_URL, AuthRouter)
app.use(process.env.EXPENSE_BASE_URL, ExpenseRouter)

app.listen(port, () => {
    logger.info(`Server is running on port ${port}`);
});
