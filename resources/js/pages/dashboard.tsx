import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { useEffect, useState } from 'react';

import { Plus } from 'lucide-react';

import { DateSeparator } from '@/components/dates/date-separator';
import { SelectMonth } from '@/components/dates/select-month';
import CreateTransactionDialog from '@/components/transaction/create-transaction-dialog';
import EditTransactionDialog from '@/components/transaction/edit-transaction-dialog';
import { TransactionItem } from '@/components/transaction/transaction-item';
import AppLayout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/utils';
import { type BreadcrumbItem } from '@/types';
import { type Account, type Category, type Transaction } from '@/types/models';
import { Head, router, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export interface DashboardData {
    income: number;
    expense: number;
    total: number;
}

interface DashboardProps {
    dashboardData: DashboardData;
    transactions: Transaction[];
    accounts: Account[];
    categories: Category[];
    mainCurrency: string;
    selectedDate?: string;
    [key: string]: unknown;
}

export default function Dashboard() {
    const { props } = usePage<DashboardProps>();
    const { dashboardData, transactions, accounts, categories, selectedDate } = props;
    const { income = 0, expense = 0, total = 0 } = dashboardData || {};

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsEditDialogOpen(true);
    };

    // Initialize selected month from server-provided query (if present)
    useEffect(() => {
        if (selectedDate) {
            const parsed = new Date(selectedDate);
            if (!Number.isNaN(parsed.getTime())) {
                setSelectedMonth(parsed);
            }
        }
    }, [selectedDate]);

    // Keep URL in sync with the selected month using Inertia GET
    useEffect(() => {
        const year = selectedMonth.getFullYear();
        const month = String(selectedMonth.getMonth() + 1).padStart(2, '0');
        const dateParam = `${year}-${month}-01`;
        router.get('/dashboard', { date: dateParam }, { preserveScroll: true, preserveState: true, replace: true });
    }, [selectedMonth]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="mt-4 flex justify-end px-4">
                <SelectMonth selectedMonth={selectedMonth} onMonthSelect={setSelectedMonth} />
            </div>

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stats Cards */}
                <Card className="grid grid-cols-3 gap-1 overflow-hidden text-center">
                    <div>
                        <span className="block text-xs font-medium">Income</span>
                        <span className="text-sm font-semibold">{formatCurrency(income, props.mainCurrency)}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-medium">Expense</span>
                        <span className="text-sm font-semibold">{formatCurrency(expense, props.mainCurrency)}</span>
                    </div>
                    <div>
                        <span className="block text-xs font-medium">Total</span>
                        <span className={`text-sm font-semibold ${total > 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                            {formatCurrency(total, props.mainCurrency)}
                        </span>
                    </div>
                </Card>

                {/* Recent Transactions */}
                {transactions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Plus className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="mb-2 text-lg font-semibold">No transactions yet</h3>
                        <p className="mb-4 text-muted-foreground">Start tracking your finances by adding your first transaction</p>
                        <Button onClick={() => setIsCreateDialogOpen(true)}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Transaction
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-3 pb-18">
                        {(() => {
                            // Initialize with today's date in YYYY-MM-DD format
                            let currentDate = new Date().toISOString().split('T')[0];

                            return transactions.map((transaction) => {
                                const showSeparator = transaction.transaction_date !== currentDate;

                                if (showSeparator) {
                                    currentDate = transaction.transaction_date;
                                }

                                return (
                                    <div key={transaction.id}>
                                        {showSeparator && <DateSeparator date={transaction.transaction_date} />}
                                        <TransactionItem transaction={transaction} onEdit={handleEdit} />
                                    </div>
                                );
                            });
                        })()}
                    </div>
                )}

                {/* Floating Action Button */}
                <Button className="fixed right-6 bottom-6 h-14 w-14 rounded-full shadow-lg" size="icon" onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-6 w-6" />
                </Button>

                {/* Create Transaction Drawer */}
                <CreateTransactionDialog
                    open={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    accounts={accounts}
                    categories={categories}
                />

                {/* Edit Transaction Dialog */}
                <EditTransactionDialog
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    accounts={accounts}
                    categories={categories}
                    transaction={editingTransaction}
                    onSuccess={() => {
                        setEditingTransaction(null);
                        setIsEditDialogOpen(false);
                    }}
                />
            </div>
        </AppLayout>
    );
}
