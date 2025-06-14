import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import MySettingsMain from '../assets/components/dashboard-components/MySettingsMain'

function MySettings() {
  return (
    <>
    <Helmet>
        <title>Settings - IT Service Pro</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <MySettingsMain />
      </div>
    </div>
    </>
  )
}

export default MySettings