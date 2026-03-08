import type { Category, CategorySpendingProps } from '../types';
import { CATEGORY_METADATA } from '../types';

export const CategorySpending = ({
    expensesByCategory,
    totalExpenses,
}: CategorySpendingProps) => {
    const sortedCategories = Object.entries(expensesByCategory)
        .sort(([, a], [, b]) => b - a)
        .filter(([, amount]) => amount > 0);

    if (sortedCategories.length === 0) {
        return null;
    }

    const maxAmount = Math.max(...sortedCategories.map(([, amount]) => amount));

    return (
        <div className="clean-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Expense Breakdown</h2>
            </div>

            <div className="space-y-6">
                {sortedCategories.map(([category, amount], index) => {
                    const meta = CATEGORY_METADATA[category as Category];
                    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                    const barWidth = totalExpenses > 0 ? (amount / maxAmount) * 100 : 0;

                    return (
                        <div key={category} className="group animate-slide-up" style={{ animationDelay: `₦{index * 100}ms` }}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-lg">
                                        {meta.icon}
                                    </div>
                                    <span className="font-semibold text-slate-700">{meta.label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold tracking-wide text-slate-800">₦{amount.toFixed(2)}</span>
                                    <span className="text-sm text-slate-500 font-medium w-12 text-right">{(percentage).toFixed(1)}%</span>
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-1000 ease-out bg-orange-400 relative overflow-hidden"
                                    style={{ width: `₦{barWidth}%` }}
                                >
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {totalExpenses > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="bg-slate-50 rounded-xl p-4 flex-1">
                        <span className="text-slate-500 text-sm font-semibold block mb-1 uppercase tracking-wider">Top category</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">{CATEGORY_METADATA[sortedCategories[0][0] as Category].icon}</span>
                            <strong className="text-slate-800 text-lg">{CATEGORY_METADATA[sortedCategories[0][0] as Category].label}</strong>
                        </div>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-4 flex-1 text-right">
                        <span className="text-slate-500 text-sm font-semibold block mb-1 uppercase tracking-wider">Total spend</span>
                        <strong className="text-2xl font-bold text-slate-800">
                            ₦{totalExpenses.toFixed(2)}
                        </strong>
                    </div>
                </div>
            )}
        </div>
    );
};
