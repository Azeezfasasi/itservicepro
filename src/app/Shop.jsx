import React from 'react'
import TopHeader from '../assets/components/TopHeader'
import MainHeader from '../assets/components/MainHeader'
import { Helmet } from 'react-helmet'
import ProductListForCustomers from '../assets/components/product/ProductListForCustomers'
import Footer from '../assets/components/Footer'

function Shop() {
  return (
    <>
    <Helmet>
        <title>Shop - IT Service Pro</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <ProductListForCustomers />
    <Footer />
    </>
  )
}

export default Shop