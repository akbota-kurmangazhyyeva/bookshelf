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
    <div className="flex items-center space-x-4">
      <input
        type="text"
        placeholder="Search for a book..."
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        className="p-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
