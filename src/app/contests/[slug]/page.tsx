'use client';
import { Key, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; 
import axios from 'axios';
import { Contest } from '@/types';
import { useAuth } from '@/hooks/useAuth'; // Assuming useAuth hook is implemented for session management

const ContestDetail: React.FC = () => {
  const [contest, setContest] = useState<Contest | null>(null);
  const slug = usePathname(); // Get the slug from URL params
  const router = useRouter(); // Use router to navigate back or elsewhere
  const [loading, setLoading] = useState(true);
  const [newTest, setNewTest] = useState<any>({
    bookId: '',
    questions: [{ text: '', answers: ['', '', ''], correctAnswer: '' }]
  });
  const { session } = useAuth(); // Check if user is logged in

  useEffect(() => {
    const fetchContest = async () => {
      if (slug) {
        try {
          const contestId = slug.split('-').pop(); // Extract contest ID from the slug
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/contest/get-contest/${contestId}`
          );
          setContest(response.data);
        } catch (error) {
          console.error('Failed to fetch contest details', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchContest();
  }, [slug]);

  const handleAddTest = async () => {
    if (!session) {
      alert('Please log in to add a test.');
      return;
    }
    
    try {
      const contestId = slug.split('-').pop();
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/contest/create-test`,
        {
          contestId,
          ...newTest,
        }
      );
      setContest((prevContest) => {
        if (prevContest) {
          return {
            ...prevContest,
            tests: [...(prevContest.tests || []), response.data], // Update the tests with the newly created test
          };
        }
        return prevContest;
      });
      setNewTest({ bookId: '', questions: [{ text: '', answers: ['', '', ''], correctAnswer: '' }] }); // Reset form
    } catch (error) {
      console.error('Failed to add test', error);
    }
  };

  const handleNavigateToTest = (testId: string) => {
    router.push(`/contests/${slug}/tests/test-${testId}`); // Navigate to the individual test page
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg">Loading contest details...</div>;
  }

  if (!contest) {
    return <div className="text-center mt-10 text-lg">Contest not found</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <button
        className="mb-4 bg-gray-200 p-2 rounded"
        onClick={() => router.back()}
      >
        Back to Contests
      </button>

      <h1 className="text-3xl font-bold mb-6">{contest.genre}</h1>

      <div className="bg-white p-6 shadow-md rounded-lg">
        <p className="text-sm text-gray-700">
          Start: {new Date(contest.start).toLocaleString()}
        </p>
        <p className="text-sm text-gray-700">
          End: {new Date(contest.end).toLocaleString()}
        </p>
        <p className="text-sm text-gray-700">Status: {contest.status}</p>

        {contest.tests.length > 0 ? (
          contest.tests.map((test, testIndex) => (
            <div key={testIndex}>
              <h3 onClick={() => handleNavigateToTest(test.id)} className="cursor-pointer text-blue-500">
                Test {testIndex + 1}
              </h3>
              {test.questions.length > 0 ? (
                test.questions.map((question, questionIndex) => (
                  <span key={questionIndex}>{question.text}</span>
                ))
              ) : (
                <span>Add the first question!</span>
              )}
            </div>
          ))
        ) : (
          <span>Add the first test!</span>
        )}

        {/* Form to add new test */}
        {session && (
          <div className="mt-6">
            <h3>Add a New Test</h3>
            <input
              type="text"
              placeholder="Book ID"
              value={newTest.bookId}
              onChange={(e) => setNewTest({ ...newTest, bookId: e.target.value })}
              className="mb-2 p-2 border border-gray-300 rounded"
            />
            <div>
              {newTest.questions.map((question: { text: string | number | readonly string[] | undefined; correctAnswer: string | number | readonly string[] | undefined; }, qIndex: Key | null | undefined) => (
                <div key={qIndex} className="mb-4">
                  <input
                    type="text"
                    placeholder="Question"
                    value={question.text}
                    onChange={(e) =>
                      setNewTest((prevTest: { questions: any; }) => {
                        const questions = [...prevTest.questions];
                        questions[qIndex as number].text = e.target.value;
                        return { ...prevTest, questions };
                      })
                    }
                    className="mb-2 p-2 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Correct Answer"
                    value={question.correctAnswer}
                    onChange={(e) =>
                      setNewTest((prevTest: { questions: any; }) => {
                        const questions = [...prevTest.questions];
                        questions[qIndex as number].correctAnswer = e.target.value;
                        return { ...prevTest, questions };
                      })
                    }
                    className="p-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleAddTest}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Test
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContestDetail;
