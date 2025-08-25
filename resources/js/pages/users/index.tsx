import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Form, Head, router, usePage } from '@inertiajs/react';
import { EllipsisVertical, Pencil, Trash } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

interface Paginated<T> {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    current_page: number;
    last_page: number;
    per_page: number;
    from: number;
    to: number;
    total: number;
}

interface UserRow {
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
}

interface SharedProps {
    auth?: { user?: { id: number; name: string; email: string } | null };
    [key: string]: unknown;
}

interface UsersPageProps extends SharedProps {
    users: Paginated<UserRow>;
    filters: {
        search: string;
        sort: string;
        direction: 'asc' | 'desc';
        status: string;
    };
    errors: Record<string, string>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Users',
        href: '/users',
    },
];

function classNames(...c: (string | false | null | undefined)[]) {
    return c.filter(Boolean).join(' ');
}

export default function UsersIndex() {
    const { users, filters } = usePage<UsersPageProps>().props;
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;

    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? ''); // Add state for status filter

    const [sort, setSort] = useState(filters.sort ?? 'name');
    const [direction, setDirection] = useState<'asc' | 'desc'>(filters.direction ?? 'asc');

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState({ name: '', email: '', password: '' });

    // Debounced realtime search with status filter
    useEffect(() => {
        const id = setTimeout(() => {
            router.get(route('users.index'), { search, status, sort, direction }, { preserveState: true, replace: true });
        }, 350);
        return () => clearTimeout(id);
    }, [search, status]); // Include status in the dependencies

    function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
        setStatus(e.target.value);
    }

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        } else if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    function toggleSort(column: string) {
        if (sort === column) {
            const next = direction === 'asc' ? 'desc' : 'asc';
            setDirection(next);
            router.get(route('users.index'), { search, sort: column, direction: next }, { preserveState: true, replace: true });
        } else {
            setSort(column);
            setDirection('asc');
            router.get(route('users.index'), { search, sort: column, direction: 'asc' }, { preserveState: true, replace: true });
        }
    }

    function openCreate() {
        setEditingId(null);
        setForm({ name: '', email: '', password: '' });
        setDialogOpen(true);
    }

    function openEdit(u: UserRow) {
        setEditingId(u.id);
        setForm({ name: u.name, email: u.email, password: '' });
        setDialogOpen(true);
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { id, value } = e.target;
        setForm((f) => ({ ...f, [id]: value }));
    }

    // Delete dialog state
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    function openDelete(id: number) {
        setDeleteId(id);
        setDeleteOpen(true);
    }

    const sortIcon = useMemo(
        () => (col: string) => {
            if (sort !== col) {
                return '↕';
            }
            return direction === 'asc' ? '↑' : '↓';
        },
        [sort, direction],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header & actions */}
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">Users</h1>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Manage users with realtime search and sortable columns.</p>
                    </div>
                    <div>
                        <button
                            onClick={openCreate}
                            className="rounded-sm border border-black bg-[#1b1b18] px-4 py-2 text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                        >
                            Add User
                        </button>
                    </div>
                </div>

                <div className="flex w-full items-center gap-2">
                    <input
                        id="search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search users..."
                        className="w-2/2 rounded-sm border border-[#e3e3e0] bg-white p-2 text-sm dark:border-[#3E3E3A] dark:bg-[#0a0a0a]"
                    />
                    <select
                        id="status"
                        value={status}
                        onChange={handleStatusChange}
                        className="w-1/3 rounded-sm border border-[#e3e3e0] bg-white p-2 text-sm dark:border-[#3E3E3A] dark:bg-[#0a0a0a]"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="overflow-x-auto rounded-md border border-[#e3e3e0] dark:border-[#3E3E3A]">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#f7f7f5] text-left text-[#706f6c] dark:bg-[#161615] dark:text-[#A1A09A]">
                            <tr>
                                <th className="cursor-pointer px-4 py-2 select-none" onClick={() => toggleSort('name')}>
                                    Name <span className="ml-1 text-xs">{sortIcon('name')}</span>
                                </th>
                                <th className="cursor-pointer px-4 py-2 select-none" onClick={() => toggleSort('email')}>
                                    Email <span className="ml-1 text-xs">{sortIcon('email')}</span>
                                </th>
                                <th className="cursor-pointer px-4 py-2 select-none" onClick={() => toggleSort('created_at')}>
                                    Created <span className="ml-1 text-xs">{sortIcon('created_at')}</span>
                                </th>
                                <th className="px-4 py-2 text-left">Status</th> {/* New column for Status */}
                                <th className="px-4 py-2 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.data.map((u) => (
                                <tr key={u.id} className="border-t border-[#e3e3e0] dark:border-[#3E3E3A]">
                                    <td className="px-4 py-2">{u.name}</td>
                                    <td className="px-4 py-2">{u.email}</td>
                                    <td className="px-4 py-2">{new Date(u.created_at).toLocaleString()}</td>

                                    {/* Status Badge */}
                                    <td className="px-4 py-1">
                                        <span
                                            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${
                                                u.status === 'active' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                            }`}
                                        >
                                            {u.status === 'active' ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>

                                    <td className="px-4 py-2 text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" aria-label="Actions">
                                                    <EllipsisVertical className="size-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        openEdit(u);
                                                    }}
                                                >
                                                    <Pencil className="size-4" />
                                                    <span>Edit</span>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    variant="destructive"
                                                    onSelect={(e) => {
                                                        e.preventDefault();
                                                        openDelete(u.id);
                                                    }}
                                                >
                                                    <Trash className="size-4" />
                                                    <span>Delete</span>
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-[#706f6c] dark:text-[#A1A09A]">
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>



                <div className="mt-3 flex items-center justify-between">
                    {/* Total Results with Paginated Count */}
                    <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        {users.data.length > 0
                            ? `Showing ${users.from}–${users.to} of ${users.total} users`
                            : 'No users found'}
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-wrap gap-2">
                        {users.links.map((l, idx) => (
                            <button
                                key={idx}
                                disabled={!l.url}
                                onClick={() => l.url && router.visit(l.url, { preserveState: true, preserveScroll: true })}
                                className={classNames(
                                    'rounded-sm border px-3 py-1 text-sm',
                                    l.active
                                        ? 'border-black bg-black text-white dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A]'
                                        : 'border-[#e3e3e0] text-[#1b1b18] dark:border-[#3E3E3A] dark:text-[#EDEDEC]',
                                )}
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        ))}
                    </div>
                </div>


            </div>

            {/* Dialog for create/edit */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingId ? 'Edit User' : 'Add User'}</DialogTitle>
                    </DialogHeader>

                    <Form
                        method={editingId ? 'put' : 'post'}
                        action={editingId ? route('users.update', editingId) : route('users.store')}
                        options={{ preserveScroll: true }}
                        onSuccess={() => setDialogOpen(false)}
                        resetOnSuccess
                        className="flex flex-col gap-3"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <Label htmlFor="name" className="mb-1 block text-sm">
                                        Name
                                    </Label>
                                    <Input id="name" name="name" defaultValue={form.name} onChange={handleChange} />
                                    {errors?.name && <div className="mt-1 text-xs text-[#b3261e]">{errors.name}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="email" className="mb-1 block text-sm">
                                        Email
                                    </Label>
                                    <Input id="email" name="email" type="email" defaultValue={form.email} onChange={handleChange} />
                                    {errors?.email && <div className="mt-1 text-xs text-[#b3261e]">{errors.email}</div>}
                                </div>
                                <div>
                                    <Label htmlFor="password" className="mb-1 block text-sm">
                                        {editingId ? 'Password (optional)' : 'Password'}
                                    </Label>
                                    <Input id="password" name="password" type="password" onChange={handleChange} />
                                    {errors?.password && <div className="mt-1 text-xs text-[#b3261e]">{errors.password}</div>}
                                </div>
                                <DialogFooter className="mt-2 gap-2">
                                    <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {editingId ? 'Update' : 'Create'}
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Dialog for delete */}
            <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete user</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        Are you sure you want to delete this user? This action cannot be undone.
                    </p>

                    <Form
                        method="delete"
                        action={deleteId ? route('users.destroy', deleteId) : '#'}
                        options={{ preserveScroll: true }}
                        onSuccess={() => setDeleteOpen(false)}
                        resetOnSuccess
                    >
                        {({ processing }) => (
                            <DialogFooter className="gap-2">
                                <Button type="button" variant="secondary" onClick={() => setDeleteOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" variant="destructive" disabled={processing}>
                                    Delete
                                </Button>
                            </DialogFooter>
                        )}
                    </Form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
