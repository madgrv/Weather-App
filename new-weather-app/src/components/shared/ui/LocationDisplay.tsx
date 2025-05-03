import React from 'react';
import { getFlagEmoji } from '../../../helpers';
import { Location, Selection } from '../../../types';

type LocationDisplayProps = {
  locations: Location[];
  selection?: Selection;
  handleLocationSelect: (selection: Selection) => void;
  setUserInput: (value: string) => void;
};

export const LocationDisplay = ({
  locations,
  handleLocationSelect,
  setUserInput,
}: LocationDisplayProps) => {
  function handleClick(selection: Selection) {
    handleLocationSelect(selection);
    setUserInput('');
  }

  return (
    <ol className="absolute z-10 mt-1 w-full bg-white border-4 border-white rounded-b-md shadow-md list-none p-0 max-h-72 overflow-auto">
      {locations.map((item, index) => (
        <li
          key={index}
          onClick={() => handleClick(item)}
          className="flex items-center justify-between px-4 py-3 rounded hover:bg-slate-100 cursor-pointer transition-colors"
        >
          <span>
            {item.name}, {item.state}
          </span>
          <span className="ml-2">{getFlagEmoji(item.country)}</span>
        </li>
      ))}
    </ol>
  );
};
