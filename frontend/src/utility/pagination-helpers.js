/**
 * Returns visible item range for the current page
 * Example: "Showing 21–30 of 132"
 */
export function getPaginationInfo(currentPage, itemsPerPage, totalItems) {
  if (!totalItems || itemsPerPage <= 0) {
    return { start: 0, end: 0, total: 0 };
  }

  const start = Math.min(
    (currentPage - 1) * itemsPerPage + 1,
    totalItems
  );

  const end = Math.min(
    currentPage * itemsPerPage,
    totalItems
  );

  return { start, end, total: totalItems };
}

/**
 * Returns total page count
 */
export function getTotalPages(totalItems, itemsPerPage) {
  if (!totalItems || itemsPerPage <= 0) return 0;
  return Math.ceil(totalItems / itemsPerPage);
}

/**
 * Returns visible page numbers with ellipsis
 * Example: [1, '...', 4, 5, 6, '...', 20]
 */
export function getVisiblePages(
  currentPage,
  totalPages,
  maxVisible = 3
) {
  if (totalPages <= maxVisible + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(2, currentPage - half);
  let end = Math.min(totalPages - 1, currentPage + half);

  if (currentPage <= half + 1) {
    start = 2;
    end = maxVisible + 1;
  }

  if (currentPage >= totalPages - half) {
    start = totalPages - maxVisible;
    end = totalPages - 1;
  }

  pages.push(1);

  if (start > 2) pages.push('...');

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) pages.push('...');

  pages.push(totalPages);

  return pages;
}
