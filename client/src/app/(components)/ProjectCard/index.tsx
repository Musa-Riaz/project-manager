import { Project } from '@/state/api'
import React from 'react'

type Props = {
    project: Project
}

const ProjectCard = ({project}: Props) => {
  return (
    <div className='rounded border p-4 shadow'>
        <h3>
           {project.name}
           <p>{project.description}</p> 
           <p>Start Date{project.startDate}</p>
           <p>End Date{project.endDate}</p>
        </h3>
    </div>
  )
}

export default ProjectCard