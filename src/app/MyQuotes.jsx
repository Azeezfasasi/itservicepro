import React from 'react'
import CustomerQuoteDetailsMain from '../assets/components/dashboard-components/CustomerQuoteDetailsMain'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import { Helmet } from 'react-helmet'
import CustomerQuotesListMain from '../assets/components/dashboard-components/CustomerQuoteListMain'

function MyQuotes() {
  return (
    <>
    <Helmet>
        <title>My Quotes - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <CustomerQuotesListMain />
      </div>
    </div>
    </>
  )
}

export default MyQuotes

