import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import SendNewsletterMain from '../assets/components/dashboard-components/SendNewsletterMain';

function SendNewsletter() {
  return (
    <>
    <Helmet>
        <title>Send Newsletter - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <SendNewsletterMain />
      </div>
    </div>
    </>
  )
}

export default SendNewsletter;