interface Props {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
    onPageChange?: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}

export default function DataTablePagination({ currentPage, lastPage, total, perPage, onPageChange, onPerPageChange }: Props) {
    const perPageOptions = [10, 25, 50, 100];

    const getPageNumbers = () => {
        const delta = 2;
        const range: (number | string)[] = [];
        const rangeWithDots: (number | string)[] = [];
        let l: number | undefined;

        range.push(1);

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < lastPage && i > 1) {
                range.push(i);
            }
        }

        range.push(lastPage);

        for (const i of range) {
            if (typeof i === "number" && l !== undefined) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push("...");
                }
            }
            rangeWithDots.push(i);
            l = i as number;
        }


        return rangeWithDots;
    };

    return (
        <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 dark:border-gray-700 dark:bg-black">
            {/* Mobile buttons */}
            <div className="flex flex-1 justify-between sm:hidden">
                <button
                    onClick={() => onPageChange?.(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                    Previous
                </button>
                <button
                    onClick={() => onPageChange?.(currentPage + 1)}
                    disabled={currentPage === lastPage}
                    className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                    Next
                </button>
            </div>

            {/* Desktop */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div className="flex items-center gap-x-3">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Showing <span className="font-medium">{(currentPage - 1) * perPage + 1}</span> to{' '}
                        <span className="font-medium">{Math.min(currentPage * perPage, total)}</span> of <span className="font-medium">{total}</span>{' '}
                        results
                    </span>

                    {/* Per Page Dropdown */}
                    <div className="relative">
                        <select
                            value={perPage}
                            onChange={(e) => onPerPageChange?.(Number(e.target.value))}
                            className="block rounded-md border border-gray-300 bg-white py-1.5 pr-8 pl-3 text-sm text-gray-700 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
                        >
                            {perPageOptions.map((option) => (
                                <option key={option} value={option}>
                                    {option} / page
                                </option>
                            ))}
                        </select>
                        {/* Custom dropdown arrow */}
                        <span className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        </span>
                    </div>
                </div>

                {/* Pagination buttons */}
                <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <button
                            onClick={() => onPageChange?.(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Previous
                        </button>
                        {getPageNumbers().map((page, index) =>
                            page === '...' ? (
                                <span
                                    key={`${page}-${index}`}
                                    className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={`${page}-${index}`}
                                    onClick={() => onPageChange?.(Number(page))}
                                    className={`relative inline-flex items-center border px-4 py-2 text-sm font-medium ${
                                        currentPage === page
                                            ? 'z-10 border-indigo-500 bg-indigo-50 text-indigo-600 dark:bg-indigo-900 dark:text-indigo-200'
                                            : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    {page}
                                </button>
                            ),
                        )}
                        <button
                            onClick={() => onPageChange?.(currentPage + 1)}
                            disabled={currentPage === lastPage}
                            className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        >
                            Next
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    );
}
