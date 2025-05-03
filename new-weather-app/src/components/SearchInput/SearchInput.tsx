import React, { FormEvent } from 'react';
import { LocationDisplay } from '../shared/ui/LocationDisplay';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card } from '../ui/card';
import { Location, Selection } from '../../types';

type SearchInputProps = {
  userInput: string;
  setUserInput: (value: string) => void;
  locations: Location[];
  handleSearch: () => void;
  handleLocationSelect: (selection: Selection) => void;
};

export const SearchInput = ({
  userInput,
  setUserInput,
  locations,
  handleSearch,
  handleLocationSelect,
}: SearchInputProps) => {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  return (
    <Card className="w-full max-w-2xl sticky top-1 mb-2 p-4">
      <form onSubmit={handleSubmit} className="flex items-center">
        <Input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter city name"
          required
          className="h-[3em] rounded-l-md border-2 border-primary focus:ring-2 focus:ring-primary/50"
        />
        <Button type="submit" className="h-[3em] w-2/5 max-w-[7em] rounded-r-md font-bold text-base ml-[-1px]">
          Search
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
