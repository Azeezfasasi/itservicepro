import { Helmet } from 'react-helmet'
import DashHeader from '../assets/components/dashboard-components/DashHeader'
import DashMenu from '../assets/components/dashboard-components/DashMenu'
import CreateProjectMain from '../assets/components/dashboard-components/CreateProjectMain';

function CreateProject() {
  return (
    <>
    <Helmet>
        <title>Create Project - Marshall Global Ventures</title>
    </Helmet>
    <DashHeader />
    <div className='flex flex-row justify-start gap-4'>
      <div className='hidden lg:block w-[20%]'>
        <DashMenu />
      </div>
      <div className='w-full lg:w-[80%]'>
        <CreateProjectMain />
      </div>
    </div>
    </>
  )
}

export default CreateProject;