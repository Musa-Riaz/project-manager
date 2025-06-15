import React from 'react'
import ReusablePriorityPage from '../reusablePriority'
import { Priority } from '@/state/api'
const BacklogPriorityPage = () => {
  return (
    <ReusablePriorityPage priority={Priority.Backlog}/>
  )
}

export default BacklogPriorityPage