import React from 'react'
import TopHeader from '../assets/components/TopHeader'
import MainHeader from '../assets/components/MainHeader'
import { Helmet } from 'react-helmet'
import Footer from '../assets/components/Footer'
import CheckoutMain from '../assets/components/product/CheckoutMain'

function Checkout() {
  return (
    <>
    <Helmet>
        <title>Checkout - IT Service Pro</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <CheckoutMain />
    <Footer />
    </>
  )
}

export default Checkout