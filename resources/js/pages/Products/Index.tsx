import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types/index';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/DataTable/DataTable';
import ProductFilter from '@/components/DataTable/ProductFilter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EllipsisVertical, Eye, Pencil, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { toast } from 'react-toastify';

interface Product extends Record<string, unknown> {
    id: number;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

interface Props extends PageProps {
    products: {
        data: Product[];
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
    };
    filters: {
        search?: string;
        min_price?: number;
        max_price?: number;
        in_stock?: boolean;
        is_active?: boolean;
        sort?: string;
        direction?: 'asc' | 'desc';
        per_page?: number;
    };
}

export default function Index({ products, filters }: Props) {
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const form = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        is_active: true
    });

    const handleView = (product: Product) => {
        setSelectedProduct(product);
        setViewDialogOpen(true);
    };

    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        form.setData({
            name: product.name,
            description: product.description || '',
            price: String(product.price),
            stock: String(product.stock),
            is_active: product.is_active
        });
        setEditDialogOpen(true);
    };

    const handleDelete = (product: Product) => {
        setSelectedProduct(product);
        setDeleteDialogOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(route('products.update', selectedProduct?.id), {
            onSuccess: () => {
                setEditDialogOpen(false);
                toast.success("Product updated successfully");
            },
        });
    };

    const deleteForm = useForm({});

    const confirmDelete = () => {
        if (selectedProduct) {
            deleteForm.delete(route('products.destroy', selectedProduct.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    toast.success("Product deleted successfully");
                },
                onError: () => {
                    toast.error("Failed to delete product");
                },
            });
        }
    };

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'price',
            label: 'Price',
            sortable: true,
            render: (product: Product) =>
                new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                }).format(product.price),
        },
        {
            key: 'stock',
            label: 'Stock',
            sortable: true,
        },
        {
            key: 'is_active',
            label: 'Status',
            render: (product: Product) => (
                <span
                    className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        product.is_active
                            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                            : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}
                >
                    {product.is_active ? 'Active' : 'Inactive'}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'Created At',
            sortable: true,
            render: (product: Product) => new Date(product.created_at).toLocaleDateString(),
        },
        {
            key: 'actions',
            label:'Actions',
            render: (product: Product) => (
                <div className="flex justify-end">
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <EllipsisVertical className="size-5 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleView(product);
                                }}
                            >
                                <Eye className="size-4" />
                                <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleEdit(product);
                                }}
                            >
                                <Pencil className="size-4" />
                                <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                variant="destructive"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleDelete(product);
                                }}
                            >
                                <Trash className="size-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];

    const handleFilterChange = (newFilters: Props['filters']): void => {
        router.get(
            route('products.index'),
            { ...newFilters, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handleSort = (column: keyof Product, direction: 'asc' | 'desc'): void => {
        handleFilterChange({ ...filters, sort: String(column), direction });
    };

    const handlePageChange = (page: number): void => {
        router.get(
            route('products.index'),
            { ...filters, page },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    const handlePerPageChange = (per_page: number): void => {
        handleFilterChange({ ...filters, per_page });
    };

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Dashboard', href: '/dashboard' },
                { title: 'Products', href: '/products' },
            ]}
        >
            <Head title="Products" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Header */}
                <div className="flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-semibold">Products</h1>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Manage products with realtime search and filters.</p>
                    </div>
                </div>

                {/* Filters */}
                <ProductFilter filters={filters} onFilterChange={handleFilterChange} />

                {/* Table */}
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-black">
                    <DataTable
                        data={products}
                        columns={columns}
                        onSort={handleSort}
                        sortColumn={filters.sort}
                        sortDirection={filters.direction}
                        onPageChange={handlePageChange}
                        onPerPageChange={handlePerPageChange}
                    />
                </div>
            </div>

            {/* View Dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>View Product</DialogTitle>
                    </DialogHeader>
                    {selectedProduct && (
                        <div className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Name</Label>
                                <div className="text-sm">{selectedProduct.name}</div>
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <div className="text-sm">{selectedProduct.description}</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Price</Label>
                                    <div className="text-sm">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(selectedProduct.price)}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Stock</Label>
                                    <div className="text-sm">{selectedProduct.stock}</div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <div className="text-sm">
                                    <span
                                        className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                                            selectedProduct.is_active
                                                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                                                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                                        }`}
                                    >
                                        {selectedProduct.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={e => form.setData('name', e.target.value)}
                            />
                            {form.errors.name && (
                                <p className="text-sm text-red-500">{form.errors.name}</p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={form.data.description}
                                onChange={e => form.setData('description', e.target.value)}
                            />
                            {form.errors.description && (
                                <p className="text-sm text-red-500">{form.errors.description}</p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={form.data.price}
                                    onChange={e => form.setData('price', e.target.value)}
                                />
                                {form.errors.price && (
                                    <p className="text-sm text-red-500">{form.errors.price}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    type="number"
                                    value={form.data.stock}
                                    onChange={e => form.setData('stock', e.target.value)}
                                />
                                {form.errors.stock && (
                                    <p className="text-sm text-red-500">{form.errors.stock}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={form.data.is_active}
                                onChange={e => form.setData('is_active', e.target.checked)}
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={form.processing}>
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this product? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
