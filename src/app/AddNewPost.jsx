import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import AddPost from '../assets/components/dashboard-components/AddPost'

function AddNewPost() {
  return (
    <>
    <Helmet>
        <title>Add New Post - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <AddPost />
      </div>
    </div>
    </>
  )
}

export default AddNewPost