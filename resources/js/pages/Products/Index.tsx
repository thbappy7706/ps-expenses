import React from 'react';
import { Head, router } from '@inertiajs/react';
import { PageProps } from '@/types';
import AppLayout from '@/layouts/app-layout';
import DataTable from '@/components/DataTable/DataTable';
import ProductFilter from '@/components/DataTable/ProductFilter';

interface Product {
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

export default function Index({ auth, products, filters }: Props) {
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
                    className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
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
            render: (product: Product) =>
                new Date(product.created_at).toLocaleDateString(),
        },
    ];

    const handleFilterChange = (newFilters: Props['filters']): void => {
        router.get(
            route('products.index'),
            { ...newFilters, page: 1 },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSort = (column: string, direction: 'asc' | 'desc'): void => {
        handleFilterChange({ ...filters, sort: column, direction });
    };

    const handlePageChange = (page: number): void => {
        router.get(
            route('products.index'),
            { ...filters, page },
            {
                preserveState: true,
                preserveScroll: true,
            }
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
                <div className="flex items-center justify-between w-full space-x-4">
                    <div className="mx-auto sm:px-6 lg:px-8 w-full">
                        {/* Filters */}
                        <ProductFilter
                            filters={filters}
                            onFilterChange={handleFilterChange}
                        />

                        {/* Table */}
                        <div className="space-y-6">
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
                </div>
            </div>


        </AppLayout>
    );
}
