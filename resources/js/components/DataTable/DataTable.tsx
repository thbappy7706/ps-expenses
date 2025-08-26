import React from 'react';
import DataTableHeader from './DataTableHeader';
import DataTablePagination from './DataTablePagination';
import { Column } from './types';

interface Props<T> {
    data: {
        data: T[];
        current_page: number;
        total: number;
        per_page: number;
        last_page: number;
    };
    columns: Column<T>[];
    onSort?: (column: string, direction: 'asc' | 'desc') => void;
    sortColumn?: string;
    sortDirection?: 'asc' | 'desc';
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}

export default function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    onSort,
    sortColumn,
    sortDirection,
    onPageChange,
    onPerPageChange,
}: Props<T>) {
    return (
        <div className="w-full overflow-hidden rounded-lg bg-white shadow dark:bg-black">
            <div className="w-full overflow-x-auto">
                <table className="w-full min-w-full table-auto divide-y divide-gray-200 dark:divide-gray-700">
                    <DataTableHeader columns={columns} onSort={onSort} sortColumn={sortColumn} sortDirection={sortDirection} />
                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-black">
                        {data.data.map((item, rowIndex) => (
                            <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                                {columns.map((column, colIndex) => (
                                    <td key={colIndex} className="px-6 py-4 text-sm whitespace-nowrap text-gray-900 dark:text-gray-200">
                                        {column.render ? column.render(item) : (item[column.key as keyof T] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <DataTablePagination
                currentPage={data.current_page}
                lastPage={data.last_page}
                total={data.total}
                perPage={data.per_page}
                onPageChange={onPageChange}
                onPerPageChange={onPerPageChange}
            />
        </div>
    );
}
