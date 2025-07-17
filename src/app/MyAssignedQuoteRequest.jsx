// import React from 'react'

// function MyAssignedQuoteRequest() {
//   return (
//     <div>MyAssignedQuoteRequest</div>
//   )
// }

// export default MyAssignedQuoteRequest

import React from 'react'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import { Helmet } from 'react-helmet'
import MyAssignedQuoteRequestMain from '../assets/components/dashboard-components/MyAssignedQuoteRequestMain'

function MyAssignedQuoteRequest() {
  return (
    <>
    <Helmet>
        <title>My Assigned Quote Request - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%] overflow-x-hidden'>
        <MyAssignedQuoteRequestMain />
      </div>
    </div>
    </>
  )
}

export default MyAssignedQuoteRequest