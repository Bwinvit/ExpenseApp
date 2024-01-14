import Expense from "../../../Database/Model/ExpenseModel.js";

const createExpense = async (req, res) => {
    try {
        const { userId, description, amount, category, date } = req.body;

        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "Invalid userId",
            });
        }

        const expense = new Expense({
            user: userId,
            description,
            amount,
            category,
            date,
        });

        await expense.save();

        res.status(201).json({
            status: "success",
            message: "Expense created successfully",
            expense,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

const getExpensesForUser = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({
                status: "error",
                message: "Invalid userId",
            });
        }

        const expenses = await Expense.find({ user: userId });

        res.status(200).json({
            status: "success",
            expenses,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

const editExpense = async (req, res) => {
    try {
        const { expenseId, description, amount, category } = req.body;

        if (!expenseId) {
            return res.status(400).json({
                status: "error",
                message: "Invalid expenseId",
            });
        }

        const currentDate = new Date();

        const updatedExpense = await Expense.findByIdAndUpdate(
            expenseId,
            { description, amount, category, date: currentDate },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                status: "error",
                message: "Expense not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Expense updated successfully",
            updatedExpense,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

const deleteExpense = async (req, res) => {
    try {
        const { expenseId } = req.query;

        if (!expenseId) {
            return res.status(400).json({
                status: "error",
                message: "Invalid expenseId",
            });
        }

        const deletedExpense = await Expense.findByIdAndDelete(expenseId);

        if (!deletedExpense) {
            return res.status(404).json({
                status: "error",
                message: "Expense not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Expense deleted successfully",
            deletedExpense,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal server error",
        });
    }
};

export { createExpense, getExpensesForUser, editExpense, deleteExpense };
