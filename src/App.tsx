import { useState } from 'react';
import {
  TransactionForm,
  TransactionList,
  Summary,
  CategorySpending,
  BudgetManager,
} from './components';
import { useFinanceData, useMonthlyStats } from './hooks';
import { Toaster } from 'react-hot-toast';
import { formatCurrency } from './lib/utils';

function App() {
  const {
    transactions,
    budgets,
    addTransaction,
    deleteTransaction,
    setBudgetLimit,
    removeBudget,
  } = useFinanceData();

  const [currentMonth] = useState(new Date());

  const { totalIncome, totalExpenses, expensesByCategory, monthTransactions } =
    useMonthlyStats(transactions, currentMonth);

  const hasIncome = totalIncome > 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Toaster position="top-center" />
      <header className="bg-white border-b border-slate-200 py-8 px-4 relative z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center animate-slide-up">
          <div className="inline-block mb-4 p-3 rounded-2xl bg-blue-50 text-blue-600">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight text-slate-900">
            Finance Snapshot
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl font-normal">
            Understand and manage your monthly cash flow with a clean, simple dashboard.
          </p>
        </div>
      </header>

      <main className="flex-1 relative z-10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          <div className="animate-slide-up delay-100">
            <Summary
              totalIncome={totalIncome}
              totalExpenses={totalExpenses}
              balance={totalIncome - totalExpenses}
              month={currentMonth}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 animate-slide-up delay-200 space-y-8">
              <TransactionForm onAddTransaction={addTransaction} budgets={budgets} />
            </div>

            <div className="lg:col-span-8 flex flex-col gap-8 animate-slide-up delay-300">
              {hasIncome ? (
                <BudgetManager
                  expensesByCategory={expensesByCategory}
                  budgets={budgets}
                  onSetBudget={setBudgetLimit}
                  onRemoveBudget={removeBudget}
                />
              ) : (
                <div className="clean-card p-8 border-dashed border-2 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Budgets Locked</h3>
                  <p className="text-slate-500 text-sm">
                    Please log your first income transaction to unlock category budgets.
                  </p>
                </div>
              )}

              {Object.keys(expensesByCategory).length > 0 && (
                <CategorySpending
                  expensesByCategory={expensesByCategory}
                  totalExpenses={totalExpenses}
                />
              )}

              <TransactionList
                transactions={monthTransactions}
                onDeleteTransaction={deleteTransaction}
              />

              {monthTransactions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="clean-card p-6 text-center">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Total Transactions</div>
                    <div className="text-4xl font-bold text-slate-800">
                      {monthTransactions.length}
                    </div>
                  </div>
                  <div className="clean-card p-6 text-center">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Average Transaction</div>
                    <div className="text-2xl font-bold text-slate-800">
                      {formatCurrency(
                        (totalIncome + totalExpenses) /
                        monthTransactions.length
                      )}
                    </div>
                  </div>
                  <div className="clean-card p-6 text-center">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider mb-2">Days with Activity</div>
                    <div className="text-4xl font-bold text-slate-800">
                      {new Set(monthTransactions.map((t) => t.date)).size}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
