'use client'
import React, { useState, useEffect } from 'react';
import { Book } from '@/types';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface SearchCriteria {
  title: string;
  authors: string;
  location: string;
  rate: number;
  description: string;
  genre: string;
  subjects: string;
}

const BOOKS_PER_PAGE = 10;

const AdvancedBookSearch: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;
  const searchParams = useSearchParams();
  const initialTitle = searchParams.get('title') || '';
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    title: initialTitle,
    authors: '',
    location: '',
    rate: 0,
    description: '',
    genre: '',
    subjects: '',
  });

  const generateSlug = (book: Book) => {
    const baseSlug = book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    return `${baseSlug}-${book._id}`;
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${base_url}/lib-book/getBooks`);
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data);
        setFilteredBooks(data);
      } catch (err) {
        setError('Error fetching books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  useEffect(() => {
    const results = books.filter(book =>
      (searchCriteria.title === '' || book.title.toLowerCase().includes(searchCriteria.title.toLowerCase())) &&
      (searchCriteria.authors === '' || book.authors.some(author => author.toLowerCase().includes(searchCriteria.authors.toLowerCase()))) &&
      (searchCriteria.location === '' || book.location.toLowerCase().includes(searchCriteria.location.toLowerCase())) &&
      (searchCriteria.rate === 0 || book.rate >= searchCriteria.rate) &&
      (searchCriteria.description === '' || book.description.toLowerCase().includes(searchCriteria.description.toLowerCase())) &&
      (searchCriteria.genre === '' || book.genre.toLowerCase().includes(searchCriteria.genre.toLowerCase())) &&
      (searchCriteria.subjects === '' || book.subjects.some(subject => subject.toLowerCase().includes(searchCriteria.subjects.toLowerCase())))
    );
    setFilteredBooks(results);
    setCurrentPage(1);
  }, [searchCriteria, books]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
    const endIndex = startIndex + BOOKS_PER_PAGE;
    setDisplayedBooks(filteredBooks.slice(startIndex, endIndex));
  }, [currentPage, filteredBooks]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSearchCriteria((prev) => ({ ...prev, [name]: value }));
  };

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={searchCriteria.title}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="authors"
          placeholder="Authors"
          value={searchCriteria.authors}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={searchCriteria.location}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <select
          name="rate"
          value={searchCriteria.rate}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        >
          <option value={0}>Any Rating</option>
          <option value={1}>1+ Stars</option>
          <option value={2}>2+ Stars</option>
          <option value={3}>3+ Stars</option>
          <option value={4}>4+ Stars</option>
          <option value={5}>5 Stars</option>
        </select>
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={searchCriteria.description}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="genre"
          placeholder="Genre"
          value={searchCriteria.genre}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          name="subjects"
          placeholder="Subjects"
          value={searchCriteria.subjects}
          onChange={handleInputChange}
          className="p-2 border border-gray-300 rounded"
        />
      </div>
      
      {displayedBooks.length === 0 ? (
        <p className="text-center">No books found.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {displayedBooks.map((book, index) => (
              <li key={`${book._id}-${index}`} className="border-b pb-2">
                <Link href={`/books/${generateSlug(book)}`} className="hover:underline">
                  <h3 className="font-bold">{book.title}</h3>
                </Link>
                <p className="text-sm text-gray-600">by {book.authors.join(', ')}</p>
                <p className="text-sm">Location: {book.location}</p>
                <p className="text-sm">Rating: {book.rate} stars</p>
                <p className="text-sm">Genre: {book.genre}</p>
                <p className="text-sm">Subjects: {book.subjects.join(', ')}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex justify-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdvancedBookSearch;