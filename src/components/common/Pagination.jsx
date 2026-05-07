import React from 'react';

const Pagination = ({
  total_pages,
  current_page,
  onPageChange,
  per_page,
  total_items,
  onPerPageChange,
}) => {
  const start_item = (current_page - 1) * per_page + 1;
  const end_item = Math.min(current_page * per_page, total_items);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage, endPage;

    if (total_pages <= maxVisiblePages) {
      startPage = 1;
      endPage = total_pages;
    } else {
      startPage = Math.max(1, current_page - Math.floor(maxVisiblePages / 2));
      endPage = Math.min(total_pages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li className={`page-item ${i === current_page ? 'active' : ''}`} key={i}>
          <button
            className="page-link"
            onClick={(e) => {
              e.preventDefault();
              onPageChange(i);
            }}
          >
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center py-3"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      {/* Left: Showing Items */}
      <div
        className="text-muted"
        style={{ fontSize: '14px', color: '#6c757d' }}
      >
        Showing {start_item} to {end_item} of {total_items} entries
      </div>

      {/* Right: Per Page Dropdown and Pagination Controls */}
      <div
        className="d-flex align-items-center gap-3"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px', // Spacing between elements on the right side
        }}
      >
        {/* Per Page Dropdown */}
        <div
          className="d-flex align-items-center"
          style={{
            whiteSpace: 'pre'
          }}
        >
          <label
            htmlFor="per_page"
            className="me-2 mb-0 text-dark"
            style={{
              marginRight: '8px',
              width: '80px', // Slightly increase label width
              color: '#333',
            }}
          >
            Per page:
          </label>
          <select
            id="per_page"
            className="form-select form-select-sm"
            value={per_page}
            onChange={(e) => onPerPageChange(parseInt(e.target.value))}
            style={{
              borderRadius: '4px',
              borderColor: '#ccc',
              backgroundColor: '#fff',
              width: '70px',  // Increased width for a more prominent dropdown
            }}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Pagination Controls */}
        <nav>
          <ul className="pagination pagination-sm mb-0" style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
            {/* Previous Button */}
            {total_pages > 1 && current_page > 1 && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(current_page - 1);
                  }}
                >
                  {'<<'}
                </button>
              </li>
            )}

            {/* Page Numbers */}
            {renderPageNumbers()}

            {/* Next Button */}
            {total_pages > 1 && current_page < total_pages && (
              <li className="page-item">
                <button
                  className="page-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(current_page + 1);
                  }}
                >
                  {'>>'}
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Pagination;
