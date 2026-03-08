import { useState } from 'react';
import type { Category, TransactionFormProps } from '../types';
import { CATEGORY_METADATA } from '../types';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

export const TransactionForm = ({ onAddTransaction, budgets, onWarning }: TransactionFormProps) => {
    // Default to income if no budgets exist, otherwise default to expense
    const [type, setType] = useState<'income' | 'expense'>(budgets && budgets.length > 0 ? 'expense' : 'income');
    const [category, setCategory] = useState<Category>(type === 'income' ? 'salary' : 'food');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseFloat(amount) <= 0) {
            alert('Please enter a valid amount');
            return;
        }

        onAddTransaction({
            type,
            category,
            amount: parseFloat(amount),
            description,
            date,
        });
        toast.success("Transaction added successfully!");

        setAmount('');
        setDescription('');
        setDate(new Date().toISOString().split('T')[0]);
        // Reset to expense only if budgets exist, otherwise reset to income
        if (budgets && budgets.length > 0) {
            setType('expense');
            setCategory('food');
        } else {
            setType('income');
            setCategory('salary');
        }
    };

    const expenseCategories = Object.entries(CATEGORY_METADATA)
        .filter(([, meta]) => meta.type === 'expense')
        .map(([key]) => key as Category);

    const incomeCategories = Object.entries(CATEGORY_METADATA)
        .filter(([, meta]) => meta.type === 'income')
        .map(([key]) => key as Category);

    const categories = type === 'income' ? incomeCategories : expenseCategories;

    if (!categories.includes(category)) {
        setCategory(categories[0]);
    }

    const hasBudgets = budgets && budgets.length > 0;

    const handleExpenseToggleClick = () => {
        if (!hasBudgets) {
            onWarning?.('You must create at least one active budget before logging an expense.');
            toast.error('You must create a budget first');
        } else {
            setType('expense');
            onWarning?.(null);
        }
    };

    const handleIncomeToggleClick = () => {
        setType('income');
        onWarning?.(null);
    };

    return (
        <form className="clean-card p-6 sm:p-8" onSubmit={handleSubmit}>
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">New Transaction</h2>
            </div>

            <div className="mb-6">
                <div className="p-1 bg-slate-100 rounded-xl flex gap-1 relative overflow-hidden">
                    <button
                        type="button"
                        className={cn(
                            "flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 relative z-10",
                            type === 'income'
                                ? "text-blue-700 bg-white shadow-sm ring-1 ring-slate-900/5"
                                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                        onClick={handleIncomeToggleClick}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                            Income
                        </span>
                    </button>
                    <button
                        type="button"
                        className={cn(
                            "flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 relative z-10 group",
                            type === 'expense'
                                ? "text-blue-700 bg-white shadow-sm ring-1 ring-slate-900/5"
                                : !hasBudgets
                                    ? "text-slate-400 opacity-60 cursor-not-allowed"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                        )}
                        onClick={handleExpenseToggleClick}
                    >
                        <span className="flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                            Expense
                            {!hasBudgets && <span className="ml-1 text-xs">🔒</span>}
                        </span>
                    </button>
                </div>
            </div>

            <div className="space-y-5 mb-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Amount</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <span className="text-slate-400 sm:text-lg font-medium">₦</span>
                        </div>
                        <input
                            id="amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                            className="w-full pl-8 pr-4 py-3 clean-input rounded-xl text-lg font-medium tracking-wide placeholder:font-normal"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Category</label>
                    <div className="relative">
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as Category)}
                            className="w-full pl-10 pr-4 py-3 clean-input rounded-xl appearance-none cursor-pointer text-slate-700"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                        >
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {CATEGORY_METADATA[cat].label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-xl">
                            {CATEGORY_METADATA[category]?.icon}
                        </div>
                    </div>
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                    <input
                        id="description"
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="What was this for?"
                        className="w-full px-4 py-3 clean-input rounded-xl"
                    />
                </div>

                <div>
                    <label htmlFor="date" className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Date</label>
                    <input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        className="w-full px-4 py-3 clean-input rounded-xl"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-8 py-3.5 rounded-xl font-bold tracking-wide transition-all bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg active:scale-[0.98] flex items-center justify-center gap-2"
            >
                Add Transaction
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </form>
    );
};
