export type TransactionType = 'income' | 'expense';

export type Category =
    | 'salary'
    | 'freelance'
    | 'food'
    | 'transportation'
    | 'utilities'
    | 'entertainment'
    | 'health'
    | 'shopping'
    | 'other';

export interface Transaction {
    id: string;
    type: TransactionType;
    category: Category;
    amount: number;
    description: string;
    date: string; // ISO date string
}

export interface Budget {
    category: Category;
    limit: number;
}

export interface CategoryMetadata {
    icon: string;
    color: string;
    label: string;
    type: TransactionType;
}

// Component Props
export interface BudgetManagerProps {
    expensesByCategory: Record<Category, number>;
    budgets: Budget[];
    onSetBudget: (category: Category, limit: number) => void;
    onRemoveBudget: (category: Category) => void;
}

export interface SummaryProps {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    month: Date;
}

export interface CategorySpendingProps {
    expensesByCategory: Record<Category, number>;
    totalExpenses: number;
}

export interface TransactionListProps {
    transactions: Transaction[];
    onDeleteTransaction: (id: string) => void;
}

export interface TransactionFormProps {
    onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
    budgets?: Budget[];
    onWarning?: (msg: string | null) => void;
}

export const CATEGORY_METADATA: Record<Category, CategoryMetadata> = {
    salary: {
        icon: '💼',
        color: '#4CAF50',
        label: 'Salary',
        type: 'income',
    },
    freelance: {
        icon: '💻',
        color: '#8BC34A',
        label: 'Freelance',
        type: 'income',
    },
    food: {
        icon: '🍔',
        color: '#FF6B6B',
        label: 'Food & Dining',
        type: 'expense',
    },
    transportation: {
        icon: '🚗',
        color: '#FF8C42',
        label: 'Transportation',
        type: 'expense',
    },
    utilities: {
        icon: '⚡',
        color: '#FFC107',
        label: 'Utilities',
        type: 'expense',
    },
    entertainment: {
        icon: '🎬',
        color: '#9C27B0',
        label: 'Entertainment',
        type: 'expense',
    },
    health: {
        icon: '🏥',
        color: '#E91E63',
        label: 'Health & Fitness',
        type: 'expense',
    },
    shopping: {
        icon: '🛍️',
        color: '#00BCD4',
        label: 'Shopping',
        type: 'expense',
    },
    other: {
        icon: '📌',
        color: '#9E9E9E',
        label: 'Other',
        type: 'expense',
    },
};
