import { SearchBar, SearchFilters, SearchResults } from '@/domain/search/_module';

function SearchPage() {
  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <section>
        <SearchBar />
      </section>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Filters Sidebar */}
        <SearchFilters className="w-64 flex-shrink-0" />

        {/* Results */}
        <div className="flex-1">
          <SearchResults />
        </div>
      </div>
    </div>
  );
}

export { SearchPage };
