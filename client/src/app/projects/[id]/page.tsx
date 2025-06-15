"use client"
import React from 'react'
import { useState } from 'react';
import ProjectHeader from './ProjectHeader';
import Board from '../BoardView';
import List from '../ListView'
import TimeLine from '../TimeLineView'
import Table from '../TableView'
import ModalNewTask from '../../(components)/ModalNewTask';

type Props = {
    params: {id: string}
    
}

const Project = ({params}: Props) => {
    const { id }  = params;
    const [activeTab, setActiveTab] = useState("Board");
    const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);

  return (
    <div>
        
        <ModalNewTask id={id} isOpen={isModalNewTaskOpen} onClose={() => setIsModalNewTaskOpen(false)} />
        {/* Modal new Task */}
        <ProjectHeader activeTab = {activeTab} setActiveTab = {setActiveTab} projectId={id} />
       
        {activeTab === "Board" && (
            <Board id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === "List" && (
            <List id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
        )}
        {activeTab === "TimeLine" && (
            <TimeLine id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />   
        )}
        {activeTab === "Table" && (
            <Table id={id} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />   
        )}
    </div>
  )
}

export default Project