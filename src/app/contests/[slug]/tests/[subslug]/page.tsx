'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation'; 
import axios from 'axios';
// import { useAuth } from '@/hooks/useAuth';

interface Test {
  id: string;
  bookId: string;
  questions: { text: string; answers: string[]; correctAnswer: string }[];
}

const TestDetail: React.FC = () => {
  const [test, setTest] = useState<Test | null>(null);
  const subslug = usePathname(); // Get the full path, including slug and subslug
  const router = useRouter();
  // const { session } = useAuth(); // Assuming session management

  const testId = subslug?.split('tests/test-').pop(); // Extract test ID from the URL
    console.log("testId",testId)
  useEffect(() => {
    const fetchTest = async () => {
      if (testId) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/contest/get-test/${testId}`
          );
          setTest(response.data);
        } catch (error) {
          console.error('Failed to fetch test details', error);
        }
      }
    };

    fetchTest();
  }, [testId]);

  if (!test) {
    return <div className="text-center mt-10 text-lg">Loading test details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <button className="mb-4 bg-gray-200 p-2 rounded" onClick={() => router.back()}>
        Back to Contest
      </button>

      <h1 className="text-3xl font-bold mb-6">Test: {test.bookId}</h1>

      <div className="bg-white p-6 shadow-md rounded-lg">
        {test.questions.length > 0 ? (
          test.questions.map((question, qIndex) => (
            <div key={qIndex} className="mb-4">
              <h3 className="font-semibold">Question {qIndex + 1}:</h3>
              <p>{question.text}</p>
              <ul className="list-disc list-inside">
                {question.answers.map((answer, aIndex) => (
                  <li key={aIndex}>{answer}</li>
                ))}
              </ul>
              <p className="text-green-500">
                Correct Answer: {question.correctAnswer}
              </p>
            </div>
          ))
        ) : (
          <p>No questions available for this test.</p>
        )}
      </div>
    </div>
  );
};

export default TestDetail;
