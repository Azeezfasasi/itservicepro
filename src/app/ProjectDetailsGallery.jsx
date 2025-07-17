import React from 'react'
import { Helmet } from 'react-helmet'
import MainHeader from '../assets/components/MainHeader'
import ProjectDetailsGalleryMain from '../assets/components/ProjectDetailsGalleryMain'
import TopHeader from '../assets/components/TopHeader'
import TawkToChat from '../assets/components/TawkToChat'

function ProjectDetailsGallery() {
  return (
    <>
    <TawkToChat />
    <Helmet>
        <title>Project Details | Marshall Global Ventures</title>
    </Helmet>
    <TopHeader />
    <MainHeader />
    <ProjectDetailsGalleryMain />
    </>
  )
}

export default ProjectDetailsGallery