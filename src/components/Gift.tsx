import React from 'react'
import Link from 'next/link'

const Gift = () => {
  return (
    <div className='w-full'>
      <div className="flex flex-row gap-8 items-end">
        {/* First element: Image */}
        <div className='flex items-start justify-center w-1/2'>
          <img src="/gift.png" alt="gift" className="w-full h-auto" />
        </div>

        {/* Second element: Button, aligned at the bottom */}
        <div className='flex items-end justify-center w-1/2 p-12'>
          <Link href='/give-book'>
            <span className="bg-lightgreen text-white py-4 px-6 rounded-xl lg:text-4xl">
              Подарите книгу
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Gift
