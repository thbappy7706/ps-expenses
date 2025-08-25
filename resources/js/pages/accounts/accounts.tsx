import { useState } from 'react';
import { Head, Form } from '@inertiajs/react';
import { Plus, Edit, Trash2, DollarSign } from 'lucide-react';

import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import InputError from '@/components/input-error';
import CurrencySelect, { CURRENCIES } from '@/components/currency-select';
import Heading from '@/components/heading';
import type { Account } from '@/types/models';

interface AccountsProps {
  accounts: Account[];
}

export default function Accounts({ accounts }: AccountsProps) {
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsEditDrawerOpen(true);
  };

  // Delete is handled via a Dialog + Inertia Form below

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = CURRENCIES.find(c => c.code === currencyCode);
    return currency?.symbol || currencyCode;
  };

  const resetCreateDrawer = () => {
    setIsCreateDrawerOpen(false);
  };

  const resetEditDrawer = () => {
    setIsEditDrawerOpen(false);
    setEditingAccount(null);
  };

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Accounts', href: '/accounts' },
      ]}
    >
      <Head title="Accounts" />

      <div className="space-y-6 p-4">
        <div className="flex items-center justify-between">
          <Heading title="Accounts" />
          
          <Dialog open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                Create Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <Form
                method="post"
                action={route('accounts.store')}
                onSuccess={resetCreateDrawer}
                resetOnSuccess
              >
                {({ processing, errors }) => (
                  <>
                    <DialogTitle>Create New Account</DialogTitle>
                    <DialogDescription>
                      Add a new account to track your finances
                    </DialogDescription>

                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Account Name</Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g. Checking Account, Savings"
                          required
                          disabled={processing}
                        />
                        <InputError message={errors.name} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currency">Currency</Label>
                        <CurrencySelect
                          name="currency"
                          placeholder="Select currency..."
                          disabled={processing}
                          required
                        />
                        <InputError message={errors.currency} />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={processing}>
                        {processing ? 'Creating...' : 'Create Account'}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={processing}>
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </>
                )}
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {accounts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
              <CardTitle className="text-center mb-2">No accounts yet</CardTitle>
              <CardDescription className="text-center mb-4">
                Create your first account to start tracking your finances
              </CardDescription>
              <Dialog open={isCreateDrawerOpen} onOpenChange={setIsCreateDrawerOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4" />
                    Create Account
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {accounts.map((account) => (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                      <CardDescription>
                        {getCurrencySymbol(account.currency)} • {account.currency}
                      </CardDescription>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(account)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Delete account?</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{account.name}"? This action cannot be undone.
                          </DialogDescription>

                          <Form method="delete" action={route('accounts.destroy', account.id)} options={{ preserveScroll: true }}>
                            {({ processing }) => (
                              <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                  <Button variant="secondary" disabled={processing}>
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <Button variant="destructive" disabled={processing} asChild>
                                  <button type="submit">Delete</button>
                                </Button>
                              </DialogFooter>
                            )}
                          </Form>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Created {new Date(account.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Account Dialog */}
        <Dialog open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
          <DialogContent>
            {editingAccount && (
              <Form
                method="put"
                action={route('accounts.update', editingAccount.id)}
                onSuccess={resetEditDrawer}
              >
                {({ processing, errors }) => (
                  <>
                    <DialogTitle>Edit Account</DialogTitle>
                    <DialogDescription>
                      Update your account information
                    </DialogDescription>

                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Account Name</Label>
                        <Input
                          id="edit-name"
                          name="name"
                          defaultValue={editingAccount.name}
                          placeholder="e.g. Checking Account, Savings"
                          required
                          disabled={processing}
                        />
                        <InputError message={errors.name} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="edit-currency">Currency</Label>
                        <CurrencySelect
                          name="currency"
                          value={editingAccount.currency}
                          placeholder="Select currency..."
                          disabled={processing}
                          required
                        />
                        <InputError message={errors.currency} />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button type="submit" disabled={processing}>
                        {processing ? 'Updating...' : 'Update Account'}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline" disabled={processing}>
                          Cancel
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </>
                )}
              </Form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
