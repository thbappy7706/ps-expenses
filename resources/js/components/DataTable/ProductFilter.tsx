import React from "react";
import { debounce } from "lodash";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// ProductFilter.tsx
interface ProductFilterProps {
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
    onFilterChange: (filters: ProductFilterProps['filters']) => void;
}

export default function ProductFilter({ filters, onFilterChange }: ProductFilterProps) {
    const debouncedFilterChange = debounce(onFilterChange, 300);

    return (
        <div className="bg-white dark:bg-black p-4 rounded-lg shadow mb-4 space-y-4">
            <div className="flex flex-wrap gap-4">
                {/* Search Input */}
                <div className="flex-1 min-w-[200px]">
                    <label
                        htmlFor="search"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        Search
                    </label>
                    <Input
                        type="text"
                        id="search"
                        defaultValue={filters.search || ""}
                        onChange={(e) =>
                            debouncedFilterChange({
                                ...filters,
                                search: e.target.value,
                            })
                        }
                        className="mt-1"
                        placeholder="Search products..."
                    />
                </div>

                {/* Price Range */}
                <div className="flex gap-2 min-w-[300px]">
                    <div className="flex-1">
                        <label
                            htmlFor="min_price"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Min Price
                        </label>
                        <Input
                            type="number"
                            id="min_price"
                            defaultValue={filters.min_price || ""}
                            onChange={(e) =>
                                debouncedFilterChange({
                                    ...filters,
                                    min_price: Number(e.target.value) || undefined,
                                })
                            }
                            className="mt-1"
                        />
                    </div>
                    <div className="flex-1">
                        <label
                            htmlFor="max_price"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Max Price
                        </label>
                        <Input
                            type="number"
                            id="max_price"
                            defaultValue={filters.max_price || ""}
                            onChange={(e) =>
                                debouncedFilterChange({
                                    ...filters,
                                    max_price: Number(e.target.value) || undefined,
                                })
                            }
                            className="mt-1"
                        />
                    </div>
                </div>

                {/* Checkboxes */}
                <div className="flex items-end gap-4">
                    <div>
                        <div className="flex items-center">
                            <Checkbox
                                id="in_stock"
                                checked={filters.in_stock || false}
                                onCheckedChange={(checked) =>
                                    onFilterChange({
                                        ...filters,
                                        in_stock: checked ? true : undefined
                                    })
                                }
                            />
                            <label
                                htmlFor="in_stock"
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                                In Stock
                            </label>
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <Checkbox
                                id="is_active"
                                checked={filters.is_active || false}
                                onCheckedChange={(checked) =>
                                    onFilterChange({
                                        ...filters,
                                        is_active: checked ? true : undefined
                                    })
                                }
                            />
                            <label
                                htmlFor="is_active"
                                className="ml-2 block text-sm text-gray-700 dark:text-gray-300"
                            >
                                Active Only
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
