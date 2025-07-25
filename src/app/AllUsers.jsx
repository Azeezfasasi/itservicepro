import React from 'react'
import { Helmet } from 'react-helmet';
import DashHeader from '../assets/components/dashboard-components/DashHeader';
import DashMenu from '../assets/components/dashboard-components/DashMenu';
import AllUserMain from '../assets/components/dashboard-components/AllUserMain';

function AllUsers() {
  return (
    <>
    <Helmet>
        <title>All Users - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <AllUserMain />
      </div>
    </div>
    </>
  )
}

export default AllUsers;