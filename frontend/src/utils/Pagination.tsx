"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number; // Optional: use if backend returns total pages
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  onPageChange,
  totalPages = 10,
}) => {
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-4 py-2 rounded-md disabled:opacity-50"
      >
        Previous
      </Button>

      <span className="text-sm font-medium">Page {currentPage}</span>

      <Button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-4 py-2 rounded-md"
      >
        Next
      </Button>
    </div>
  );
};
