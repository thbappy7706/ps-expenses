import React from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types/index';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/DataTable/DataTable';
import ProductFilter from '@/components/DataTable/ProductFilter';

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
        </AppLayout>
    );
}
