import { useState } from 'react';
import type { Category, BudgetManagerProps } from '../types';
import { CATEGORY_METADATA } from '../types';
import { useBudgetStatus } from '../hooks';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export const BudgetManager = ({
    expensesByCategory,
    budgets,
    onSetBudget,
    onRemoveBudget,
}: BudgetManagerProps) => {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [budgetAmount, setBudgetAmount] = useState('');

    const budgetStatus = useBudgetStatus(expensesByCategory, budgets);

    const expenseCategories = Object.entries(CATEGORY_METADATA)
        .filter(([, meta]) => meta.type === 'expense')
        .map(([key]) => key as Category);

    const handleAddBudget = () => {
        if (selectedCategory && budgetAmount && parseFloat(budgetAmount) > 0) {
            onSetBudget(selectedCategory, parseFloat(budgetAmount));
            toast.success("Budget set successfully!");
            setBudgetAmount('');
            setSelectedCategory(null);
        }
    };

    const categoriesWithoutBudget = expenseCategories.filter(
        (cat) => !budgets.some((b) => b.category === cat)
    );

    return (
        <div className="clean-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Budgets</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 p-5 bg-slate-50 rounded-2xl mb-8 items-end w-full">
                <div className="flex flex-col flex-1 w-full">
                    <label htmlFor="category-select" className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2 ml-1">Category</label>
                    <select
                        id="category-select"
                        value={selectedCategory || ''}
                        onChange={(e) => setSelectedCategory(e.target.value as Category)}
                        disabled={categoriesWithoutBudget.length === 0}
                        className="px-4 py-3 clean-input rounded-xl appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-slate-700 bg-white"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                        <option value="">Select...</option>
                        {categoriesWithoutBudget.map((cat) => (
                            <option key={cat} value={cat}>
                                {CATEGORY_METADATA[cat].label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex flex-col flex-1 w-full">
                    <label htmlFor="budget-amount" className="text-xs font-semibold tracking-wider text-slate-500 uppercase mb-2 ml-1">Target Limit</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <span className="text-slate-400">₦</span>
                        </div>
                        <input
                            id="budget-amount"
                            type="number"
                            step="0.01"
                            min="0"
                            value={budgetAmount}
                            onChange={(e) => setBudgetAmount(e.target.value)}
                            placeholder="0.00"
                            disabled={!selectedCategory}
                            className="w-full pl-8 pr-4 py-3 clean-input rounded-xl disabled:opacity-50 disabled:cursor-not-allowed tracking-wide bg-white text-slate-800"
                        />
                    </div>
                </div>

                <div className="flex flex-col shrink-0 w-full sm:w-auto">
                    <button
                        className="w-full sm:w-auto px-6 py-3.5 text-white rounded-xl font-bold tracking-wide transition-all bg-teal-600 hover:bg-teal-700 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                        onClick={handleAddBudget}
                        disabled={!selectedCategory || !budgetAmount}
                    >
                        Set Budget
                    </button>
                </div>
            </div>

            {budgetStatus.length === 0 ? (
                <div className="text-center py-6 text-slate-400">
                    <p>No active limits established.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {budgetStatus.map((budget, index) => {
                        const meta = CATEGORY_METADATA[budget.category];

                        return (
                            <div key={budget.category} className="clean-card bg-white hover:bg-slate-50/50 rounded-2xl p-5 border border-slate-100 transition-all animate-slide-up hover:shadow-sm" style={{ animationDelay: `${index * 100}ms` }}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl">
                                            {meta.icon}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-slate-800 text-lg">{meta.label}</div>
                                            <div className="text-sm text-slate-500 mt-0.5 font-medium tracking-wide">
                                                <span className="text-slate-800 font-bold">₦{budget.spent.toFixed(2)}</span> / ₦{budget.limit.toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="p-2 rounded-xl transition-all text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                                        onClick={() => {
                                            onRemoveBudget(budget.category);
                                            toast.success("Budget removed.");
                                        }}
                                        title="Remove budget"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="w-full bg-slate-100 rounded-full h-2 mb-3 overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
                                            budget.isOverBudget ? "bg-rose-500" : "bg-teal-500"
                                        )}
                                        style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                                    >
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className={cn(
                                        "text-sm font-semibold tracking-wide flex items-center gap-1.5",
                                        budget.isOverBudget ? "text-rose-600" : "text-teal-600"
                                    )}>
                                        {budget.isOverBudget ? (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                Over by ₦{(budget.spent - budget.limit).toFixed(2)}
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                ₦{budget.remaining.toFixed(2)} remaining
                                            </>
                                        )}
                                    </span>
                                    <span className="text-sm font-bold text-slate-700">
                                        {budget.percentage.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
