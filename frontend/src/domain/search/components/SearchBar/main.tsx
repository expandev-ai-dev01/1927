import { useState, useEffect, useRef } from 'react';
import { Search, History, X, Loader2 } from 'lucide-react';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { useSuggestions } from '../../hooks';
import { useSearchStore } from '../../stores';
import type { SearchBarProps } from './types';

function SearchBar({ onSearch, className }: SearchBarProps) {
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { suggestions, isLoading } = useSuggestions(localTerm);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setLocalTerm(value);
    if (value.length >= 2) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (localTerm.length >= 2) {
      setSearchTerm(localTerm);
      setShowSuggestions(false);
      setShowHistory(false);
      onSearch?.();
    }
  };

  const handleSuggestionClick = (text: string) => {
    setLocalTerm(text);
    setSearchTerm(text);
    setShowSuggestions(false);
    onSearch?.();
  };

  const handleClear = () => {
    setLocalTerm('');
    setSearchTerm('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setShowHistory(false);
    }
  };

  return (
    <div className={cn('relative w-full', className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar móveis..."
            value={localTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (localTerm.length >= 2) setShowSuggestions(true);
            }}
            className="h-12 pl-10 pr-20 text-base shadow-sm transition-all focus-visible:ring-2"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {localTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setShowHistory(!showHistory);
                setShowSuggestions(false);
              }}
              className="h-8 w-8"
            >
              <History className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button
          onClick={handleSearch}
          disabled={localTerm.length < 2}
          size="lg"
          className="h-12 px-6 shadow-sm"
        >
          Buscar
        </Button>
      </div>

      {(showSuggestions || showHistory) && (
        <div
          ref={dropdownRef}
          className="bg-popover absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border shadow-lg"
        >
          {showSuggestions && (
            <div className="p-2">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                </div>
              ) : suggestions?.length > 0 ? (
                <div className="space-y-1">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors"
                    >
                      <Search className="text-muted-foreground h-4 w-4" />
                      <span>{suggestion.text}</span>
                      <span className="text-muted-foreground ml-auto text-xs capitalize">
                        {suggestion.type === 'product'
                          ? 'Produto'
                          : suggestion.type === 'category'
                          ? 'Categoria'
                          : 'Termo'}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground py-8 text-center text-sm">
                  Nenhuma sugestão encontrada
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { SearchBar };
