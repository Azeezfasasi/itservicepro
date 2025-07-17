import React from 'react'
import TopHeader from '../assets/components/TopHeader'
import MainHeader from '../assets/components/MainHeader'
import { Helmet } from 'react-helmet'
import ProductListForCustomers from '../assets/components/product/ProductListForCustomers'
import Footer from '../assets/components/Footer'
import TawkToChat from '../assets/components/TawkToChat'

function Shop() {
  return (
    <>
    <TawkToChat />
    <Helmet>
        <title>Shop - Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <ProductListForCustomers />
    <Footer />
    </>
  )
}

export default Shop