import React from 'react'
import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import ProductDetailsMain from '../assets/components/product/ProductDetailsMain'
import { Footer } from 'rsuite'
import TopHeader from '../assets/components/TopHeader'
import MainHeader from '../assets/components/MainHeader'

function ProductDetails() {
  return (
    <>
    <Helmet>
        <title>Product Details - IT Service Pro</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <ProductDetailsMain />
    <Footer />
    </>
  )
}

export default ProductDetails