import type { SummaryProps } from '../types';
import { cn } from '../lib/utils';

export const Summary = ({
    totalIncome,
    totalExpenses,
    balance,
    month,
}: SummaryProps) => {
    const monthName = month.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const savingsRate =
        totalIncome > 0
            ? ((balance / totalIncome) * 100).toFixed(1)
            : '0';

    return (
        <div className="mx-auto w-full">
            <div className="mb-6 flex items-center gap-3 border-b border-slate-200 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-800">
                    {monthName}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="clean-card p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Total Income</div>
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 relative z-10">
                        ₦{totalIncome.toFixed(2)}
                    </div>
                </div>

                <div className="clean-card p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Total Expenses</div>
                        <div className="p-2 bg-rose-50 text-rose-600 rounded-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 relative z-10">
                        ₦{totalExpenses.toFixed(2)}
                    </div>
                </div>

                <div className={cn(
                    "clean-card p-6 relative overflow-hidden group transition-shadow",
                    balance < 0 ? "border-rose-200 bg-rose-50" : "hover:shadow-md"
                )}>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Net Balance</div>
                        <div className={cn(
                            "p-2 rounded-lg group-hover:scale-110 transition-transform",
                            balance >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-100 text-rose-600"
                        )}>
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                    </div>
                    <div className={cn(
                        "text-2xl font-bold relative z-10",
                        balance >= 0 ? "text-emerald-600" : "text-rose-600"
                    )}>
                        ₦{Math.abs(balance).toFixed(2)}
                        {balance < 0 && <span className="text-sm font-normal ml-2 opacity-70">(Deficit)</span>}
                    </div>
                </div>

                <div className="clean-card p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className="text-slate-500 text-sm font-semibold tracking-wide uppercase">Savings Rate</div>
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 relative z-10">
                        {savingsRate}%
                    </div>
                </div>
            </div>
        </div>
    );
};
