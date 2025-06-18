import cart from '../../images/cart.svg'
import { Link } from 'react-router-dom'
import { Badge } from 'rsuite';

function CartIcon() {
  return (
    <>
    <Link to="/app/cart" className='lg:hidden block'>
        <Badge content={2}>
            <img src={cart} alt="profile" className='w-10 h-10 lg:hidden block' />
        </Badge>
    </Link>

    <Link to="/app/cart" className='hidden lg:block'>
        <Badge content={2}>
            <img src={cart} alt="profile" className='w-10 h-10 hidden lg:block' />
        </Badge>
    </Link>
    </>
  )
}

export default CartIcon