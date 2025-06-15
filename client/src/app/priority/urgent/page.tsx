import React from 'react'
import ReusablePriorityPage from '../reusablePriority'
import { Priority } from '@/state/api'


const UrgentPriorityPage = () => {
  return (
    <ReusablePriorityPage priority={Priority.Urgent}/>
 
  )
}

export default UrgentPriorityPage