import * as React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/core/lib/utils';
import { Button } from './button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis-start');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }

    pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav className={cn('flex items-center gap-1', className)} aria-label="Pagination">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {pages.map((page, index) => {
        if (typeof page === 'string') {
          return (
            <div key={page} className="flex h-10 w-10 items-center justify-center">
              <MoreHorizontal className="text-muted-foreground h-4 w-4" />
            </div>
          );
        }

        return (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            size="icon"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </Button>
        );
      })}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}

export { Pagination };
