import express from "express";
import dotenv from "dotenv";

import {
    createExpense,
    deleteExpense,
    editExpense,
    getExpensesForUser,
} from "../Controller/ExpenseController.js";

dotenv.config();

export const ExpenseRouter = express.Router();

ExpenseRouter.post(process.env.EXPENSE_CREATE_ENDPOINT, createExpense);
ExpenseRouter.get(process.env.EXPENSE_GET_ENDPOINT, getExpensesForUser);
ExpenseRouter.put(process.env.EXPENSE_EDIT_ENDPOINT, editExpense);
ExpenseRouter.delete(process.env.EXPENSE_DELETE_ENDPOINT, deleteExpense);
