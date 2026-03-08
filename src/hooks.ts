import { useState, useEffect, useCallback } from 'react';
import type { Transaction, Budget, Category } from './types';

const TRANSACTIONS_KEY = 'finance_transactions';
const BUDGETS_KEY = 'finance_budgets';

export const useFinanceData = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);

    // Load from localStorage
    useEffect(() => {
        const stored = localStorage.getItem(TRANSACTIONS_KEY);
        if (stored) {
            try {
                setTransactions(JSON.parse(stored));
            } catch {
                console.error('Failed to parse transactions');
            }
        }

        const storedBudgets = localStorage.getItem(BUDGETS_KEY);
        if (storedBudgets) {
            try {
                setBudgets(JSON.parse(storedBudgets));
            } catch {
                console.error('Failed to parse budgets');
            }
        }
    }, []);

    // Persist transactions
    useEffect(() => {
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
    }, [transactions]);

    // Persist budgets
    useEffect(() => {
        localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
    }, [budgets]);

    const addTransaction = useCallback((transaction: Omit<Transaction, 'id'>) => {
        const newTransaction: Transaction = {
            ...transaction,
            id: Date.now().toString(),
        };
        setTransactions((prev) => [newTransaction, ...prev]);
        return newTransaction;
    }, []);

    const deleteTransaction = useCallback((id: string) => {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const setBudgetLimit = useCallback((category: Category, limit: number) => {
        setBudgets((prev) => {
            const existing = prev.find((b) => b.category === category);
            if (existing) {
                return prev.map((b) =>
                    b.category === category ? { ...b, limit } : b
                );
            }
            return [...prev, { category, limit }];
        });
    }, []);

    const removeBudget = useCallback((category: Category) => {
        setBudgets((prev) => prev.filter((b) => b.category !== category));
    }, []);

    return {
        transactions,
        budgets,
        addTransaction,
        deleteTransaction,
        setBudgetLimit,
        removeBudget,
    };
};

export const useMonthlyStats = (transactions: Transaction[], month?: Date) => {
    const now = month || new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.date);
        return tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear;
    });

    const totalIncome = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const expensesByCategory = monthTransactions
        .filter((t) => t.type === 'expense')
        .reduce(
            (acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            },
            {} as Record<Category, number>
        );

    const incomeByCategory = monthTransactions
        .filter((t) => t.type === 'income')
        .reduce(
            (acc, t) => {
                acc[t.category] = (acc[t.category] || 0) + t.amount;
                return acc;
            },
            {} as Record<Category, number>
        );

    return {
        monthTransactions,
        totalIncome,
        totalExpenses,
        balance,
        expensesByCategory,
        incomeByCategory,
    };
};

export const useBudgetStatus = (
    expensesByCategory: Record<Category, number>,
    budgets: Budget[]
) => {
    return budgets.map((budget) => {
        const spent = expensesByCategory[budget.category] || 0;
        const percentage = (spent / budget.limit) * 100;
        const isOverBudget = spent > budget.limit;

        return {
            category: budget.category,
            limit: budget.limit,
            spent,
            percentage: Math.min(percentage, 100),
            isOverBudget,
            remaining: Math.max(0, budget.limit - spent),
        };
    });
};
