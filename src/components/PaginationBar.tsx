import Link from "next/link";
import React from "react";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
}) => {
  const maxPage = Math.min(totalPages, Math.max(currentPage + 4, 10));
  const minPage = Math.max(1, Math.min(currentPage - 5, maxPage - 9));

  const pageNavigateItems: JSX.Element[] = [];

  for (let page = minPage; page <= maxPage; page++) {
    pageNavigateItems.push(
      <Link
        href={`?page=${page}`}
        key={page}
        className={`btn join-item ${
          currentPage === page ? "btn-active pointer-events-none" : ""
        }`}
      >
        {page}
      </Link>,
    );
  }
  return <div className="join">{pageNavigateItems}</div>;
};

export default PaginationBar;
