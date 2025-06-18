import { Helmet } from 'react-helmet'
import Footer from '../assets/components/Footer'
import TopHeader from '../assets/components/TopHeader'
import MainHeader from '../assets/components/MainHeader'
import WishlistMain from '../assets/components/dashboard-components/WishlistMain'

function Wishlist() {
  return (
    <>
    <Helmet>
        <title>Wishlist - IT Service Pro</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <WishlistMain />
    <Footer />
    </>
  )
}

export default Wishlist