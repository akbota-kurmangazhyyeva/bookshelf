'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth'; // or your custom authentication hook
import { useRouter } from 'next/navigation';

interface Contest {
  _id: string;
  genre: string;
  start: string;
  end: string;
  status: string;
  participants: string[];
  books: string[];
}

const ContestsPage: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { session } = useAuth();
    const router = useRouter();
  // Form states
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/contest/get-contests`
        );

        const sortedContests = response.data.sort(
          (a: Contest, b: Contest) =>
            new Date(a.start).getTime() - new Date(b.start).getTime()
        );
        setContests(sortedContests);
      } catch (error) {
        console.error('Failed to fetch contests', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, [session]);

  const handleCreateContest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!startTime || !endTime || !genre || !date) {
      setError('All fields are required');
      return;
    }

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contest/create-contest`,
        {
          startTime,
          endTime,
          genre,
          date,
        }
      );

      // Re-fetch contests after successful creation
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contest/get-contests`
      );
      const sortedContests = response.data.sort(
        (a: Contest, b: Contest) =>
          new Date(a.start).getTime() - new Date(b.start).getTime()
      );
      setContests(sortedContests);

      // Clear form fields
      setStartTime('');
      setEndTime('');
      setGenre('');
      setDate('');
    } catch (error) {
      console.error('Failed to create contest', error);
      setError('Failed to create contest');
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Contests</h1>

      {/* Contest Creation Form */}
      <form
        onSubmit={handleCreateContest}
        className="bg-white p-6 shadow-md rounded-lg mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">Create a New Contest</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Start Time</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">End Time</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="border border-gray-300 rounded-md p-2 w-full"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition"
        >
          Create Contest
        </button>
      </form>

      {/* List of Contests */}
      <div className="grid grid-cols-1 gap-6">
        {contests.map((contest) => {
          const slug = `${contest.genre}-${contest._id}`;

          return (
            <div
              key={contest._id}
              className="p-4 bg-gray-100 rounded-lg shadow-md cursor-pointer"
              onClick={() => router.push(`/contests/${slug}`)} // Navigate on click
            >
              <h3 className="text-lg font-semibold">{contest.genre}</h3>
              <p className="text-sm text-gray-700">
                Start: {new Date(contest.start).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">
                End: {new Date(contest.end).toLocaleString()}
              </p>
              <p className="text-sm text-gray-700">Status: {contest.status}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContestsPage;
