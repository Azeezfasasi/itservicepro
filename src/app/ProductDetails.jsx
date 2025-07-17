import React from 'react'
import { Helmet } from 'react-helmet'
import ProductDetailsMain from '../assets/components/product/ProductDetailsMain'
import { Footer } from 'rsuite'
import TopHeader from '../assets/components/TopHeader'
import MainHeader from '../assets/components/MainHeader'
import TawkToChat from '../assets/components/TawkToChat'

function ProductDetails() {
  return (
    <>
    <TawkToChat />
    <Helmet>
        <title>Product Details - Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <ProductDetailsMain />
    <Footer />
    </>
  )
}

export default ProductDetails