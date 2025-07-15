import { Helmet } from 'react-helmet';
import TopHeader from '../assets/components/TopHeader';
import MainHeader from '../assets/components/MainHeader';
import CartMain from '../assets/components/product/CartMain';
import Footer from '../assets/components/Footer';

function Cart() {
  return (
    <>
    <Helmet>
        <title>Cart - Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <CartMain />
    <Footer />
    </>
  )
}

export default Cart;