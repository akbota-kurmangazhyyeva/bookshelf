'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const SearchBar: React.FC = () => {
  const [searchTitle, setSearchTitle] = useState('');
  const router = useRouter();

  const handleSearch = () => {
    if (searchTitle.trim() !== '') {
      // Redirect to the /books page with the title as a query parameter
      router.push(`/books?title=${encodeURIComponent(searchTitle)}`);
    }
  };

  return (
    <div className="flex items-center space-x-4 w-full">
        <div className=" flex flex-row w-full gap-4">
            <input
            type="text"
            placeholder="Search for a book..."
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            className="p-2 border border-gray-300 rounded-2xl w-3/4" 
        />
        <button
            onClick={handleSearch}
            className="px-4 py-2 bg-lightgreen text-white rounded-2xl w-1/4"
        >
            Search
        </button>
        </div>
    </div>
  );
};

export default SearchBar;
