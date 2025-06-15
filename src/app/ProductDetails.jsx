import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import ProductDetailsMain from '../assets/components/product/ProductDetailsMain'
import { Footer } from 'rsuite'

function ProductDetails() {
  return (
    <>
    <Helmet>
        <title>Product Details - IT Service Pro</title>
    </Helmet>
    <ProductDetailsMain />
    {/* <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <ProductDetailsMain />
      </div>
    </div> */}
    <Footer />
    </>
  )
}

export default ProductDetails