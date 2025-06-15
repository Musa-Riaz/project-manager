import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getProjects = async (req:Request, res: Response) : Promise<void> => {
    try{
        const projects = await prisma.project.findMany({})
        res.status(200).json(projects);
    }
    catch(err){
        console.error(err);
        res.status(500).json({ error: 'An error occurred while fetching projects.' });
    }
}

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
    try {
        const {projectId} = req.params;
        const project = await prisma.project.findUnique({
            where: {
                id: Number(projectId)
            }
        })
        res.status(200).json(project);
    }
    catch(err: any){
           res.status(500).json({
            message: `Error fetching the project: ${err.message}`
        });
        console.error(err);
    
    }
}

export const createProjects = async (req: Request, res: Response): Promise<any> => {

    // first check if the project already exists or not
    const existingProject = await prisma.project.findFirst({
        where: {
            name: req.body.name
        }
    })
    if (existingProject) {
      return res.status(400).json({ 
        success:false,
        message: 'Project already exists.' });
    }

    const {name, description, startDate, endDate} = req.body;
    try{
        const newProject = await prisma.project.create({
            data: {
                name,
                description,
                startDate,
                endDate
            }
        });
        res.status(201).json({success:true,newProject});
    }
    catch(err: any){
        res.status(500).json({
            message: `Error creating projects: ${err.message}`
        });
        console.error(err);
    }
}

export const deleteProject = async (req: Request, res: Response) : Promise<void> => {
    const { projectId } = req.params;
    try {
        const deleteProject = await prisma.project.delete({
            where: {
                id: Number(projectId)
            }
        })
        res.status(200).json({
            message: `Project with id ${projectId} deleted successfully`,
            project: deleteProject
        })
    }
    catch(err: any) {
    res.status(500).json({
            message: `Error deleting the project: ${err.message}`
        });
        console.error(err);
    }
}