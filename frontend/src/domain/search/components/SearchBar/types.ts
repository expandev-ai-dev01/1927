export interface SearchBarProps {
  onSearch?: (term: string) => void | Promise<void>;
  className?: string;
}
