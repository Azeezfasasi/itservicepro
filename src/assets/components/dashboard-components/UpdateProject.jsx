import React from 'react';
import { Helmet } from 'react-helmet'
import DashHeader from './DashHeader';
import DashMenu from './DashMenu'
import UpdateProjectMain from './UpdateProjectMain';

function UpdateProject() {
  return (
    <>
    <Helmet>
        <title>Update Project - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <UpdateProjectMain />
      </div>
    </div>
    </>
  )
}

export default UpdateProject;