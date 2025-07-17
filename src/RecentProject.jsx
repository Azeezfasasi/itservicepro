import React from 'react'
import { Helmet } from 'react-helmet'
import TopHeader from './assets/components/TopHeader'
import MainHeader from './assets/components/MainHeader'
import CompletedProjects from './assets/components/CompletedProjects'
import Footer  from './assets/components/Footer'
import TawkToChat from './assets/components/TawkToChat'

function RecentProject() {
  return (
    <>
    <TawkToChat />
    <Helmet>
        <title>Recent Project - Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <CompletedProjects />
    <Footer />
    </>
  )
}

export default RecentProject