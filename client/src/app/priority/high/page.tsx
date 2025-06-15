import React from 'react'
import ReusablePriorityPage from '../reusablePriority'
import { Priority } from '@/state/api'

const HighPriorityPage = () => {
   return (
    <ReusablePriorityPage priority={Priority.High}/>
 
  )
}

export default HighPriorityPage