import AdvancedBookSearch from '@/components/AdvancedBookSearch'
import React from 'react'
import { Suspense } from "react";

const page = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <AdvancedBookSearch/>
        </Suspense>
    </div>
  )
}

export default page