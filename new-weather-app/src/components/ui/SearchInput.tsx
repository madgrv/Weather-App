import React, {
  FormEvent,
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
} from 'react';
import { createPortal } from 'react-dom';
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
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: '100%',
  });

  useEffect(() => {
    if (locations.length > 0) {
      setIsOpen(true);
      setFocusedIndex(-1);
      updateDropdownPosition();
    } else {
      setIsOpen(false);
    }
  }, [locations]);

  const updateDropdownPosition = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.height + 8, // 8px gap
        left: 0,
        width: `${rect.width}px`,
      });
    }
  };

  useEffect(() => {
    // Update dropdown position on scroll and resize
    const handlePositionUpdate = () => {
      if (isOpen && locations.length > 0) {
        updateDropdownPosition();
      }
    };

    window.addEventListener('scroll', handlePositionUpdate, true);
    window.addEventListener('resize', handlePositionUpdate);

    return () => {
      window.removeEventListener('scroll', handlePositionUpdate, true);
      window.removeEventListener('resize', handlePositionUpdate);
    };
  }, [isOpen, locations.length]);

  useEffect(() => {
    // Debounce user input to prevent excessive filtering
    if (userInput.length === 0) return;

    const timer = setTimeout(() => {
      if (userInput.length >= 2) {
        setUserInput(userInput);
      }
    }, 300); // 300ms debounce delay

    return () => clearTimeout(timer);
  }, [userInput, setUserInput]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
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

  useEffect(() => {
    if (focusedIndex >= 0 && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [focusedIndex]);

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

  const handleItemClick = (location: Location) => {
    handleLocationSelect(location);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
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
          aria-controls={
            isOpen && locations.length > 0 ? 'location-results' : ''
          }
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
      {isOpen && locations.length > 0 &&
        createPortal(
          <div
            className='fixed z-50'
            style={{
              width: dropdownPosition.width,
              left: containerRef.current?.getBoundingClientRect().left || 0,
              top: (containerRef.current?.getBoundingClientRect().bottom || 0) + 8,
            }}
          >
            <Card
              ref={resultsRef}
              className='w-full border border-primary shadow-lg rounded-md bg-background/80 backdrop-blur-md'
              tabIndex={-1}
              onKeyDown={handleDropdownKeyDown}
            >
              <CardContent
                className='p-2 overflow-y-auto'
                style={{ maxHeight: '60vh' }}
              >
                {locations.map((location, idx) => (
                  <div
                    key={location.lat + '-' + location.lon}
                    id={`location-option-${idx}`}
                    ref={(el) => (itemRefs.current[idx] = el)}
                    className={cn(
                      'flex items-center px-2 py-1 cursor-pointer rounded-sm',
                      idx === focusedIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent'
                    )}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleItemClick(location);
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleItemClick(location);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    tabIndex={0}
                    role='option'
                    aria-selected={idx === focusedIndex}
                  >
                    <span className='mr-2'>
                      {getCountryFlag(location.country ?? '')}
                    </span>
                    <span className='text-sm'>
                      {location.name},{' '}
                      {location.state ? `${location.state}, ` : ''}
                      {location.country}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>,
          document.body
        )}
      {isOpen && locations.length === 0 && (
        <div className='p-2 text-muted-foreground text-sm m-2'>
          {language?.search?.noResults || 'No locations found.'}
        </div>
      )}
    </div>
  );
};

export default React.memo(SearchInput);
