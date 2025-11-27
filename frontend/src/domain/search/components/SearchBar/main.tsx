import { useState, useEffect, useRef } from 'react';
import { Search, History, Mic, X } from 'lucide-react';
import { Input } from '@/core/components/input';
import { Button } from '@/core/components/button';
import { cn } from '@/core/lib/utils';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import type { SearchBarProps } from './types';

function SearchBar({ value, onChange, onSearch, className }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value ?? '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const { suggestions, isLoading } = useSearchSuggestions({
    partialTerm: localValue,
    enabled: localValue.length >= 2 && showSuggestions,
  });

  useEffect(() => {
    setLocalValue(value ?? '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    onChange?.(newValue);
    setShowSuggestions(newValue.length >= 2);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim().length >= 2) {
      onSearch?.(localValue.trim());
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestionText: string) => {
    setLocalValue(suggestionText);
    onChange?.(suggestionText);
    onSearch?.(suggestionText);
    setShowSuggestions(false);
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
      setLocalValue(transcript);
      onChange?.(transcript);
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
    setLocalValue('');
    onChange?.('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="text-muted-foreground absolute left-3 h-5 w-5" />
          <Input
            ref={inputRef}
            type="text"
            placeholder="Buscar móveis..."
            value={localValue}
            onChange={handleInputChange}
            onFocus={() => localValue.length >= 2 && setShowSuggestions(true)}
            className="focus-visible:border-primary focus-visible:ring-primary/20 h-12 w-full rounded-lg border-2 pl-10 pr-24 text-base shadow-sm transition-all focus-visible:ring-2"
          />
          <div className="absolute right-2 flex items-center gap-1">
            {localValue && (
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
              onClick={handleVoiceSearch}
              className={cn('h-8 w-8', isListening && 'text-destructive')}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button type="submit" size="sm" disabled={localValue.trim().length < 2} className="h-8">
              Buscar
            </Button>
          </div>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="bg-popover absolute z-50 mt-2 w-full rounded-lg border shadow-lg"
        >
          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <div className="border-primary h-5 w-5 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            ) : (
              suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className="hover:bg-accent flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors"
                >
                  <History className="text-muted-foreground h-4 w-4" />
                  <span>{suggestion.text}</span>
                  {suggestion.type === 'category' && (
                    <span className="text-muted-foreground ml-auto text-xs">Categoria</span>
                  )}
                  {suggestion.type === 'product' && (
                    <span className="text-muted-foreground ml-auto text-xs">Produto</span>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export { SearchBar };
