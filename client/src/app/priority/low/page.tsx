import React from 'react'
import ReusablePriorityPage from '../reusablePriority'
import { Priority } from '@/state/api'

const LowPriorityPage = () => {
  return (
    <ReusablePriorityPage priority={Priority.Low}/>
 
  )
}

export default LowPriorityPage