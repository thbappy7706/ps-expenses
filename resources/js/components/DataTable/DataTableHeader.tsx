import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
import { Column } from './types';

interface Props<T extends Record<string, unknown>> {
    columns: Column<T>[];
    onSort?: (column: keyof T, direction: 'asc' | 'desc') => void;
    sortColumn?: keyof T;
    sortDirection?: 'asc' | 'desc';
}

export default function DataTableHeader<T extends Record<string, unknown>>({ columns, onSort, sortColumn, sortDirection }: Props<T>) {
    const handleSort = (column: Column<T>) => {
        if (!column.sortable || !onSort) return;

        const direction = sortColumn === column.key && sortDirection === 'asc' ? 'desc' : 'asc';

        onSort(column.key, direction);
    };

    const getSortIcon = (column: Column<T>) => {
        if (!column.sortable) return null;

        if (sortColumn !== column.key) {
            return <ChevronUpIcon className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100" />;
        }

        return sortDirection === 'asc' ? (
            <ChevronUpIcon className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        ) : (
            <ChevronDownIcon className="h-4 w-4 text-gray-700 dark:text-gray-200" />
        );
    };

    return (
        <thead className="sticky bg-[#f7f7f5] text-left text-[#706f6c] dark:bg-[#161615] dark:text-[#A1A09A]">
            <tr>
                {columns.map((column, index) => (
                    <th
                        key={index}
                        onClick={() => handleSort(column)}
                        className={`px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-600 uppercase dark:text-gray-300 ${
                            column.sortable ? 'group cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''
                        }`}
                    >
                        <div className="flex items-center space-x-1">
                            <span>{column.label}</span>
                            {getSortIcon(column)}
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
}
