import React from 'react'
import ReusablePriorityPage from '../reusablePriority'
import { Priority } from '@/state/api'

const MediumPriorityPage = () => {
   return (
    <ReusablePriorityPage priority={Priority.Medium}/>
 
  )
}

export default MediumPriorityPage