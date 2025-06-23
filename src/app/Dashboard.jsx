import React from 'react'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import { Helmet } from 'react-helmet'
import DashStats from '../assets/components/dashboard-components/DashStats'
import DashChart from '../assets/components/dashboard-components/DashChart'
import ProductChart from '../assets/components/dashboard-components/ProductChart'
import { useUser } from '../assets/context-api/user-context/UseUser'

function Dashboard() {
  const { isSuperAdmin, isAdmin } = useUser()
  return (
    <>
    <Helmet>
        <title>Dashboard - IT Service Pro</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <DashStats />
        {(isSuperAdmin || isAdmin) && (
          <DashChart />
        )}
        {(isSuperAdmin || isAdmin) && (
        <ProductChart />
        )}
      </div>
    </div>
    </>
  )
}

export default Dashboard