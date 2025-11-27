import { SearchBar, SearchFilters, SearchResults } from '@/domain/search';

function SearchPage() {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-card rounded-lg border p-6 shadow-sm">
        <SearchBar />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Filters Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-6">
            <SearchFilters />
          </div>
        </aside>

        {/* Results */}
        <main>
          <SearchResults />
        </main>
      </div>
    </div>
  );
}

export { SearchPage };
