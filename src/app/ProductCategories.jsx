import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import CategoryList from '../assets/components/product/CategoryList'

function ProductCategories() {
  return (
    <>
    <Helmet>
        <title>Product Categories - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <CategoryList />
      </div>
    </div>
    </>
  )
}

export default ProductCategories