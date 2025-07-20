import React from 'react';
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader';
import DashMenu from '../assets/components/dashboard-components/DashMenu';
import AllProjectsMain from '../assets/components/dashboard-components/AllProjectsMain';

function AllProject() {
  return (
    <>
    <Helmet>
        <title>All Projects - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%] overflow-x-hidden'>
        <AllProjectsMain />
      </div>
    </div>
    </>
  )
}

export default AllProject;