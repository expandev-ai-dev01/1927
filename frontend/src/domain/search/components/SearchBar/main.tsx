import { useState, useEffect, useRef } from 'react';
import { Search, Mic, History, X } from 'lucide-react';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { useSearchStore } from '../../stores/searchStore';
import { useAutocomplete } from '../../hooks/useAutocomplete';
import { cn } from '@/core/lib/utils';
import type { SearchBarProps } from './types';

function SearchBar({ className, onSearch }: SearchBarProps) {
  const { searchTerm, setSearchTerm, searchHistory } = useSearchStore();
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const { suggestions } = useAutocomplete(localTerm);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setLocalTerm(value);
    setShowSuggestions(value.length >= 2);
    setShowHistory(false);
  };

  const handleSearch = () => {
    if (localTerm.trim().length >= 2) {
      setSearchTerm(localTerm.trim());
      setShowSuggestions(false);
      setShowHistory(false);
      onSearch?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalTerm(suggestion);
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    onSearch?.();
  };

  const handleHistoryClick = (item: (typeof searchHistory)[0]) => {
    setLocalTerm(item.termo);
    setSearchTerm(item.termo);
    setShowHistory(false);
    onSearch?.();
  };

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'pt-BR';
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setLocalTerm(transcript);
        setSearchTerm(transcript);
        onSearch?.();
      };
      recognition.start();
    } else {
      alert('Seu navegador não suporta busca por voz');
    }
  };

  const clearSearch = () => {
    setLocalTerm('');
    setSearchTerm('');
    setShowSuggestions(false);
  };

  return (
    <div ref={wrapperRef} className={cn('relative w-full', className)}>
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="text-muted-foreground absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2" />
          <Input
            type="text"
            placeholder="Buscar móveis, categorias..."
            value={localTerm}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (localTerm.length >= 2) setShowSuggestions(true);
            }}
            className="h-12 pl-10 pr-20 text-base"
          />
          <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {localTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={clearSearch}
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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className="h-8 w-8"
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleSearch} disabled={localTerm.trim().length < 2} className="h-12 px-6">
          Buscar
        </Button>
      </div>

      {/* Autocomplete Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="bg-popover absolute z-50 mt-2 w-full rounded-lg border p-2 shadow-lg">
          <div className="space-y-1">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="hover:bg-accent flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors"
              >
                <Search className="text-muted-foreground h-4 w-4" />
                <span>{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search History */}
      {showHistory && searchHistory.length > 0 && (
        <div className="bg-popover absolute z-50 mt-2 w-full rounded-lg border p-2 shadow-lg">
          <div className="text-muted-foreground mb-2 px-3 py-1 text-xs font-semibold">
            Buscas Recentes
          </div>
          <div className="space-y-1">
            {searchHistory.map((item, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(item)}
                className="hover:bg-accent flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors"
              >
                <div className="flex items-center gap-2">
                  <History className="text-muted-foreground h-4 w-4" />
                  <span>{item.termo}</span>
                </div>
                <span className="text-muted-foreground text-xs">
                  {item.total_resultados} resultados
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { SearchBar };
