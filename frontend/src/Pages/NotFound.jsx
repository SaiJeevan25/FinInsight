import React from 'react';

export default function NotFound() {
  return (
    <div className='flex flex-col gap-3 mt-40 text-center m-auto'>
      <h2 className='text-2xl flex items-center justify-center'><span className='text-red-800 text-6xl'>404</span> - Page Not Found</h2>
      <p className='text-gray-500 '>The page you are looking for does not exist.</p>
    </div>
  );
}
