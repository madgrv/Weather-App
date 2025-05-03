import React, { FormEvent } from 'react';
import { LocationDisplay } from '../shared/ui/LocationDisplay';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Location, Selection } from '../../types';
import language from '../../lib/language';

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
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Card className={`w-full max-w-full sticky top-1 mb-2 p-4 ${className || ''}`}>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder={language.searchPlaceholder}
          required
          className="h-[3em] w-full rounded-md border-2 border-primary focus:ring-2 focus:ring-primary/50"
        />
        <Button type="submit" className="h-[3em] w-full sm:w-auto px-6 rounded-md font-bold text-base">
          {language.searchButton}
        </Button>
      </form>
      {locations.length > 0 && (
        <LocationDisplay
          locations={locations}
          handleLocationSelect={handleLocationSelect}
          setUserInput={setUserInput}
        />
      )}
    </Card>
  );
};

export default React.memo(SearchInput);
