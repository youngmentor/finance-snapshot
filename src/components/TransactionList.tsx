import type { TransactionListProps } from '../types';
import { CATEGORY_METADATA } from '../types';
import { cn } from '../lib/utils';
import { toast } from 'react-hot-toast';

export const TransactionList = ({
    transactions,
    onDeleteTransaction,
}: TransactionListProps) => {
    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (sortedTransactions.length === 0) {
        return (
            <div className="text-center py-16 clean-card rounded-3xl border-dashed border-2 border-slate-200">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl opacity-80">📈</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">
                    No transactions yet
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    Your financial journey starts here. Add your first transaction to see your data come alive.
                </p>
            </div>
        );
    }

    return (
        <div className="clean-card p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-slate-100 pb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-800">Recent Transactions</h2>
            </div>

            <div className="space-y-4">
                {sortedTransactions.map((transaction, index) => {
                    const meta = CATEGORY_METADATA[transaction.category];
                    const isIncome = transaction.type === 'income';

                    return (
                        <div
                            key={transaction.id}
                            className={cn(
                                "group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl transition-all duration-300 animate-slide-up relative overflow-hidden",
                                "bg-white hover:bg-slate-50 border border-slate-100 hover:shadow-sm hover:-translate-y-0.5"
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className={cn(
                                "absolute left-0 top-0 bottom-0 w-1",
                                isIncome ? "bg-emerald-500" : "bg-rose-500"
                            )} />

                            <div className="flex items-center gap-4 flex-1 mb-4 sm:mb-0 ml-2">
                                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
                                    {meta.icon}
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold text-slate-800 text-lg">{meta.label}</div>
                                    <div className="text-slate-500 text-sm mt-0.5">
                                        {transaction.description || 'No description'}
                                    </div>
                                    <div className="text-xs text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        {new Date(transaction.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-4 ml-2 sm:ml-0">
                                <span className={cn(
                                    "font-bold text-xl tracking-tight",
                                    isIncome ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {isIncome ? '+' : '-'}₦{transaction.amount.toFixed(2)}
                                </span>
                                <button
                                    className="p-2.5 rounded-xl transition-all text-slate-400 hover:bg-rose-50 hover:text-rose-600 group-hover:opacity-100 sm:opacity-0"
                                    onClick={() => {
                                        onDeleteTransaction(transaction.id);
                                        toast.success("Transaction deleted!");
                                    }}
                                    title="Delete transaction"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
