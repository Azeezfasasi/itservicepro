import React from 'react'
import ProductForm from '../assets/components/product/ProductForm'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'

function AddProduct() {
  return (
    <>
    <Helmet>
        <title>Add Products - IT Service Pro</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <ProductForm />
      </div>
    </div>
    </>
  )
}

export default AddProduct