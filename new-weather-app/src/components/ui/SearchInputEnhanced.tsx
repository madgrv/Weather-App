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
import language from '../../lib/language';

type SearchInputEnhancedProps = {
  userInput: string;
  setUserInput: (value: string) => void;
  locations: Location[];
  handleSearch: () => void;
  handleLocationSelect: (selection: Selection) => void;
  className?: string;
};

export const SearchInputEnhanced = ({
  userInput,
  setUserInput,
  locations,
  handleSearch,
  handleLocationSelect,
  className,
}: SearchInputEnhancedProps) => {
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Reset focused index when locations change and open dropdown if there are results
  useEffect(() => {
    setFocusedIndex(-1);
    setIsOpen(locations.length > 0);
    // Reset item refs array when locations change
    itemRefs.current = locations.map(() => null);
  }, [locations]);

  // Add click outside listener to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    // Use the DOM's MouseEvent, not React's
    document.addEventListener('mousedown', handleClickOutside as EventListener);
    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside as EventListener
      );
    };
  }, [isOpen]);

  // Scroll into view when focused index changes
  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

  // Handle keyboard navigation for input field
  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // For Enter key on empty dropdown, submit the search
    if (e.key === 'Enter' && (!isOpen || !locations.length)) {
      return; // Let the form submission handle this
    }

    // For dropdown navigation
    if (isOpen && locations.length > 0) {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault(); // Prevent page scrolling
          setFocusedIndex((prev) =>
            prev < locations.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault(); // Prevent page scrolling
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

  // Handle keyboard navigation for dropdown
  const handleDropdownKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!locations.length || !isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault(); // Prevent page scrolling
        setFocusedIndex((prev) =>
          prev < locations.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault(); // Prevent page scrolling
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
        // Allow normal tab behavior but close dropdown
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Helper function to get country flag emoji
  const getCountryFlag = (countryCode: string) => {
    // Convert country code to regional indicator symbols
    // Each letter A-Z is represented by a regional indicator symbol from U+1F1E6 to U+1F1FF
    if (!countryCode || countryCode.length !== 2) return '🏳️';

    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map((char) => 127397 + char.charCodeAt(0));

    return String.fromCodePoint(...codePoints);
  };

  return (
    <div
      className={cn('w-full space-y-2 relative', className)}
      ref={containerRef}
    >
      <form onSubmit={handleSubmit} className='flex gap-2 w-full'>
        <Input
          type='text'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => locations.length > 0 && setIsOpen(true)}
          placeholder={language.searchPlaceholder}
          className='flex-1 border-2 border-primary rounded-sm focus-visible:ring-2 focus-visible:ring-primary/50'
          aria-autocomplete='list'
          aria-controls={
            isOpen && locations.length > 0 ? 'location-results' : undefined
          }
          aria-expanded={isOpen && locations.length > 0}
          aria-activedescendant={
            focusedIndex >= 0 ? `location-${focusedIndex}` : undefined
          }
          required
        />
        <Button
          type='submit'
          className='bg-primary text-primary-foreground h-[2.9em] px-6 rounded-sm hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/50'
        >
          {language.searchButton}
        </Button>
      </form>

      {isOpen && locations.length > 0 && (
        <div
          className='fixed z-50 w-full mt-1'
          style={{
            width: containerRef.current?.offsetWidth || '100%',
            left: containerRef.current?.getBoundingClientRect().left || 0,
            top: containerRef.current?.getBoundingClientRect().bottom || 0,
          }}
          ref={resultsRef}
          id='location-results'
          role='listbox'
          onKeyDown={handleDropdownKeyDown}
          tabIndex={-1}
        >
          <Card className='border-2 border-primary rounded-sm shadow-lg backdrop-blur-md bg-background/95 dark:bg-background/95'>
            <CardContent className='p-2 max-h-[300px] overflow-y-auto'>
              {locations.map((location, index) => (
                <div
                  key={`${location.lat}-${location.lon}`}
                  id={`location-${index}`}
                  ref={(el) => (itemRefs.current[index] = el)}
                  className={cn(
                    'p-2 rounded-sm cursor-pointer transition-colors flex items-center gap-2',
                    focusedIndex === index
                      ? 'bg-primary/20 text-primary'
                      : 'hover:bg-primary/10'
                  )}
                  onClick={() => {
                    handleLocationSelect(location);
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => setFocusedIndex(index)}
                  role='option'
                  aria-selected={focusedIndex === index}
                  tabIndex={-1}
                >
                  <span className='text-base' aria-hidden='true'>
                    {getCountryFlag(location.country || '')}
                  </span>
                  <span className={`text-[0.9375rem]`}>
                    {location.name}, {location.country}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchInputEnhanced);
