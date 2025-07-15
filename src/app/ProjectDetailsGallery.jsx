import React from 'react'
import { Helmet } from 'react-helmet'
import MainHeader from '../assets/components/MainHeader'
import ProjectDetailsGalleryMain from '../assets/components/ProjectDetailsGalleryMain'
import TopHeader from '../assets/components/TopHeader'

function ProjectDetailsGallery() {
  return (
    <>
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