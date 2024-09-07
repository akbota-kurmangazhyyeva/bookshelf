import React from 'react';

interface SpinnerProps {
  size?: string; // Size of the spinner (default: '8')
  color?: string; // Tailwind color (default: 'blue-500')
}

const Spinner: React.FC<SpinnerProps> = ({ size = '8', color = 'blue-500' }) => {
  return (
    <div className={`flex justify-center items-center`}>
      <div
        className={`h-${size} w-${size} border-4 border-t-transparent border-${color} border-solid rounded-full animate-spin`}
        role="status"
      />
    </div>
  );
};

export default Spinner;
