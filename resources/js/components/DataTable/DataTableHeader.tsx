import React from "react";
import { Column } from "./types";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

interface Props<T> {
    columns: Column<T>[];
    onSort?: (column: string, direction: "asc" | "desc") => void;
    sortColumn?: string;
    sortDirection?: "asc" | "desc";
}

export default function DataTableHeader<T>({
                                               columns,
                                               onSort,
                                               sortColumn,
                                               sortDirection,
                                           }: Props<T>) {
    const handleSort = (column: Column<T>) => {
        if (!column.sortable || !onSort) return;

        const direction =
            sortColumn === column.key && sortDirection === "asc" ? "desc" : "asc";
        onSort(column.key, direction);
    };

    const getSortIcon = (column: Column<T>) => {
        if (!column.sortable) return null;

        if (sortColumn !== column.key) {
            return (
                <ChevronUpIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
            );
        }

        return sortDirection === "asc" ? (
            <ChevronUpIcon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
        ) : (
            <ChevronDownIcon className="w-4 h-4 text-gray-700 dark:text-gray-200" />
        );
    };

    return (
        <thead className="bg-gray-50 dark:bg-black sticky top-0 z-10">
        <tr>
            {columns.map((column, index) => (
                <th
                    key={index}
                    onClick={() => handleSort(column)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider ${
                        column.sortable
                            ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 group"
                            : ""
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
