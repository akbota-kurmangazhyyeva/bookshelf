'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import { Review } from '@/types';

interface Book {
  title: string;
  authors: string[];
  location: string;
  rate: number;
  genre: string;
  subjects: string[];
  description: string;
}

export default function BookPage() {
  const [book, setBook] = useState<Book | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState<number>(0); // New state for rating
  const { session } = useAuth();
  const router = useRouter();
  const slug = usePathname();
  const bookId = slug ? (slug as string).split('-').pop() : '';

  useEffect(() => {
    if (bookId) {
      fetchBook();
      fetchReviews();
    }
  }, [bookId]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lib-book/getBook/${bookId}`);
      setBook(response.data);
    } catch (error) {
      console.error('Error fetching book:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lib-book/getReviews/${bookId}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleAddReview = async () => {
    if (!session) {
      alert('You must be logged in to submit a review.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lib-book/writeReview`, {
        bookId,
        text: newReview,
      });
      fetchReviews(); // Refresh reviews after submission
      setNewReview('');
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleAddRating = async () => {
    if (!session) {
      alert('You must be logged in to rate the book.');
      return;
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/lib-book/rate`, {
        rating,
        bookId,
      });
      alert('Rating added');
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  if (!book) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
      <p className="text-xl mb-2">by {book.authors.join(', ')}</p>
      <p className="mb-2"><strong>Location:</strong> {book.location}</p>
      <p className="mb-2"><strong>Rating:</strong> {book.rate} stars</p>
      <p className="mb-2"><strong>Genre:</strong> {book.genre}</p>
      <p className="mb-4"><strong>Subjects:</strong> {book.subjects.join(', ')}</p>
      <h2 className="text-2xl font-bold mb-2">Description</h2>
      <p>{book.description}</p>

      {/* Rating section */}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Rate this book</h2>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="mt-2 p-2 border"
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white"
          onClick={handleAddRating}
        >
          Submit Rating
        </button>
      </div>

      <h2 className="text-2xl font-bold mt-6">Reviews</h2>
      {reviews.length > 0 ? (
        <ul>
          {reviews.map((review) => (
            <li key={review._id} className="mt-2 p-2 border">
              <p>{review.text}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No reviews yet.</p>
      )}

      <div className="mt-6">
        <textarea
          placeholder="Write your review"
          className="w-full p-2 border"
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
        />
        <button
          className="mt-2 px-4 py-2 bg-blue-500 text-white"
          onClick={handleAddReview}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
}
