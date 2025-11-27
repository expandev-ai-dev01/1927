import { useState, useEffect, useRef } from 'react';
import { Search, History, Mic, X } from 'lucide-react';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { useSearchStore } from '../../stores/searchStore';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { useSearchHistory } from '../../hooks/useSearchHistory';
import type { SearchBarProps } from './types';

function SearchBar({ onSearch, className }: SearchBarProps) {
  const { searchTerm, setSearchTerm } = useSearchStore();
  const [localTerm, setLocalTerm] = useState(searchTerm);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading: loadingSuggestions } = useSearchSuggestions({
    partialTerm: localTerm,
    enabled: localTerm.length >= 2 && showSuggestions,
  });

  const { history } = useSearchHistory();

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
    if (localTerm.trim().length >= 2) {
      setSearchTerm(localTerm);
      setShowSuggestions(false);
      setShowHistory(false);
      onSearch?.(localTerm);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalTerm(suggestion);
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    onSearch?.(suggestion);
  };

  const handleHistoryClick = (historyItem: string) => {
    setLocalTerm(historyItem);
    setSearchTerm(historyItem);
    setShowHistory(false);
    onSearch?.(historyItem);
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
      onSearch?.(transcript);
      setIsListening(false);
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
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch();
              }
            }}
            onFocus={() => {
              if (localTerm.length >= 2) {
                setShowSuggestions(true);
              }
            }}
            className="h-12 pl-10 pr-20 text-base"
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

      {(showSuggestions || showHistory) && (
        <div
          ref={dropdownRef}
          className="bg-popover absolute left-0 right-0 top-full z-50 mt-2 max-h-96 overflow-y-auto rounded-lg border shadow-lg"
        >
          {showSuggestions && (
            <div className="p-2">
              {loadingSuggestions ? (
                <div className="text-muted-foreground px-4 py-3 text-sm">Carregando...</div>
              ) : suggestions.length > 0 ? (
                <>
                  <div className="text-muted-foreground px-4 py-2 text-xs font-semibold">
                    Sugestões
                  </div>
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.text)}
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm transition-colors"
                    >
                      <Search className="text-muted-foreground h-4 w-4" />
                      <span>{suggestion.text}</span>
                      <span className="text-muted-foreground ml-auto text-xs">
                        {suggestion.type === 'product'
                          ? 'Produto'
                          : suggestion.type === 'category'
                          ? 'Categoria'
                          : 'Termo'}
                      </span>
                    </button>
                  ))}
                </>
              ) : (
                <div className="text-muted-foreground px-4 py-3 text-sm">
                  Nenhuma sugestão encontrada
                </div>
              )}
            </div>
          )}

          {showHistory && (
            <div className="p-2">
              {history.length > 0 ? (
                <>
                  <div className="text-muted-foreground px-4 py-2 text-xs font-semibold">
                    Histórico de Buscas
                  </div>
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryClick(item.searchTerm)}
                      className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm transition-colors"
                    >
                      <History className="text-muted-foreground h-4 w-4" />
                      <div className="flex-1">
                        <div>{item.searchTerm}</div>
                        <div className="text-muted-foreground text-xs">
                          {item.resultCount} resultados •{' '}
                          {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="text-muted-foreground px-4 py-3 text-sm">
                  Nenhum histórico de busca
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
