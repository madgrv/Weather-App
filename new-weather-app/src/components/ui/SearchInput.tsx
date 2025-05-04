import React, {
  FormEvent,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import { Location, Selection } from '../../types';
import { Button } from './button';
import { Input } from './input';
import { Card, CardContent } from './card';
import { cn } from '../../lib/utils';
import { useLanguage } from '../../lib/language/useLanguage';

type SearchInputProps = {
  userInput: string;
  setUserInput: (value: string) => void;
  locations: Location[];
  handleSearch: () => void;
  handleLocationSelect: (selection: Selection) => void;
  className?: string;
};

export const SearchInput = ({
  userInput,
  setUserInput,
  locations,
  handleSearch,
  handleLocationSelect,
  className,
}: SearchInputProps) => {
  const { language } = useLanguage();

  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (locations.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setFocusedIndex(-1);
  }, [locations]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && (!isOpen || !locations.length)) {
      return;
    }
    if (isOpen && locations.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setFocusedIndex((prev) =>
            prev < locations.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
          break;
        case 'Enter':
          if (focusedIndex >= 0) {
            e.preventDefault();
            handleLocationSelect(locations[focusedIndex]);
            setIsOpen(false);
          }
          break;
        case 'Escape':
          e.preventDefault();
          setIsOpen(false);
          break;
        default:
          break;
      }
    }
  };

  const handleDropdownKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!locations.length || !isOpen) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev < locations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        if (focusedIndex >= 0) {
          e.preventDefault();
          handleLocationSelect(locations[focusedIndex]);
          setIsOpen(false);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  const getCountryFlag = (countryCode: string) => {
    if (!countryCode || countryCode.length !== 2) return '🏳️';
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  };

  return (
    <div ref={containerRef} className={className}>
      <form onSubmit={handleSubmit} className='flex gap-2 w-full'>
        <Input
          type='text'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => locations.length > 0 && setIsOpen(true)}
          placeholder={language?.search?.placeholder || 'Search for a city...'}
          aria-label={language?.search?.ariaLabel || 'Search for a city'}
          className='flex-1 border-2 border-primary rounded-sm focus-visible:ring-2 focus-visible:ring-primary/50'
          aria-autocomplete='list'
          aria-controls={isOpen && locations.length > 0 ? 'location-results' : ''}
          aria-activedescendant={
            isOpen && focusedIndex >= 0 ? `location-option-${focusedIndex}` : ''
          }
        />
        <Button
          type='submit'
          className='ml-2'
          aria-label={language?.search?.button || 'Search'}
        >
          {language?.search?.button || 'Search'}
        </Button>
      </form>
      {isOpen && locations.length > 0 && (
        <Card
          ref={resultsRef}
          className='absolute z-10 mt-1 w-full border border-primary bg-background shadow-lg rounded-md overflow-y-auto max-h-60'
          tabIndex={-1}
          onKeyDown={handleDropdownKeyDown}
        >
          <CardContent className='p-2'>
            {locations.map((location, idx) => (
              <div
                key={location.lat + '-' + location.lon}
                id={`location-option-${idx}`}
                ref={(el) => (itemRefs.current[idx] = el)}
                className={cn(
                  'flex items-center px-2 py-1 cursor-pointer rounded-sm',
                  idx === focusedIndex
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent',
                )}
                onClick={() => {
                  handleLocationSelect(location);
                  setIsOpen(false);
                }}
                onMouseEnter={() => setFocusedIndex(idx)}
                tabIndex={0}
                role='option'
                aria-selected={idx === focusedIndex}
              >
                <span className='mr-2'>{getCountryFlag(location.country ?? '')}</span>
                <span>
                  {location.name}, {location.state ? `${location.state}, ` : ''}
                  {location.country}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
      {isOpen && locations.length === 0 && (
        <div className='p-2 text-muted-foreground text-sm'>
          {language?.search?.noResults || 'No locations found.'}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchInput);
