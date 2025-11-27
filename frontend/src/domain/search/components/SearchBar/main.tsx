import { useState, useEffect, useRef } from 'react';
import { Search, History, Mic, X } from 'lucide-react';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { useSearchStore } from '../../stores/searchStore';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import { cn } from '@/core/lib/utils';
import type { SearchBarProps } from './types';

function SearchBar({ className, onSearch }: SearchBarProps) {
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading: suggestionsLoading } = useSearchSuggestions(
    localTerm,
    showSuggestions
  );
  const { history } = useSearchHistory();

  useEffect(() => {
    setLocalTerm(searchTerm);
  }, [searchTerm]);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalTerm(value);

    if (value.length >= 2) {
      setShowSuggestions(true);
      setShowHistory(false);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleSearch = () => {
    if (localTerm.trim().length >= 2) {
      setSearchTerm(localTerm.trim());
      setShowSuggestions(false);
      setShowHistory(false);
      onSearch?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
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

  const handleHistoryClick = (historyItem: { searchTerm: string }) => {
    setLocalTerm(historyItem.searchTerm);
    setSearchTerm(historyItem.searchTerm);
    setShowHistory(false);
    onSearch?.();
  };

  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Seu navegador não suporta busca por voz');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setLocalTerm(transcript);
      setSearchTerm(transcript);
      setIsListening(false);
      onSearch?.();
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleClear = () => {
    setLocalTerm('');
    setSearchTerm('');
    setShowSuggestions(false);
    setShowHistory(false);
    inputRef.current?.focus();
  };

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    setShowSuggestions(false);
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
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (localTerm.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            className="h-12 pl-10 pr-24 text-base"
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
              onClick={toggleHistory}
              className="h-8 w-8"
            >
              <History className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleVoiceSearch}
              className={cn('h-8 w-8', isListening && 'text-destructive')}
            >
              <Mic className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={handleSearch} disabled={localTerm.trim().length < 2} className="h-12 px-6">
          Buscar
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={dropdownRef}
          className="bg-popover absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border shadow-lg"
        >
          <div className="p-2">
            {suggestionsLoading ? (
              <div className="text-muted-foreground p-4 text-center text-sm">Carregando...</div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors"
                >
                  <Search className="text-muted-foreground h-4 w-4" />
                  <span>{suggestion.text}</span>
                  {suggestion.resultCount !== undefined && (
                    <span className="text-muted-foreground ml-auto text-xs">
                      {suggestion.resultCount} resultados
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* History Dropdown */}
      {showHistory && history.length > 0 && (
        <div
          ref={dropdownRef}
          className="bg-popover absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border shadow-lg"
        >
          <div className="border-b p-3">
            <h3 className="text-sm font-semibold">Buscas Recentes</h3>
          </div>
          <div className="p-2">
            {history.map((item) => (
              <button
                key={item.id}
                onClick={() => handleHistoryClick(item)}
                className="hover:bg-accent flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors"
              >
                <History className="text-muted-foreground mt-0.5 h-4 w-4 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">{item.searchTerm}</div>
                  <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                    <span>{new Date(item.createdAt).toLocaleDateString('pt-BR')}</span>
                    <span>•</span>
                    <span>{item.resultCount} resultados</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export { SearchBar };
