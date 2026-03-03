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
 * Example: [1, 2, 3, '...', 20]
 */
export function getVisiblePages(
  currentPage,
  totalPages,
  maxVisible = 3
) {
  if (totalPages <= 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [1];

  // Near the start: show first few pages + ... + last
  if (currentPage <= maxVisible) {
    for (let i = 2; i <= maxVisible; i++) pages.push(i);
    pages.push('...', totalPages);
    return pages;
  }

  // Near the end: show first + ... + last few pages
  if (currentPage >= totalPages - maxVisible + 1) {
    pages.push('...');
    for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  // In the middle: show first + ... + current + ... + last
  pages.push('...', currentPage, '...', totalPages);
  return pages;
}
