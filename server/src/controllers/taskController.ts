import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTasks = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: Number(projectId),
      },
      include: {
        author: true,
        assignee: true,
        comments: true,
        attachments: true,
      },
    });
    res.status(200).json(tasks);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: `An error occurred while fetching tasks.${err.message}` });
  }
};

// export const addComments = async (req: Request, res: Response) : Promise<void> => {
//   const { taskId } = req.params;
//   const { content, userId} = req.body;

// }

export const createTask = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
  } = req.body;
  try {
    const newTask = await prisma.task.create({
      data: {
    title,
    description,
    status,
    priority,
    tags,
    startDate,
    dueDate,
    points,
    projectId,
    authorUserId,
    assignedUserId,
      },
    });
    res.status(201).json(newTask);
  } catch (err: any) {
    res.status(500).json({
      message: `Error creating task: ${err.message}`,
    });
    console.error(err);
  }
};


export const updatTaskStatus = async (req: Request, res: Response): Promise<void> => {
  const {taskId} = req.params;
  const { status } = req.body;

  try {
    const updatedTask = await prisma.task.update({
      where: {
        id: Number(taskId),
      },
     data: {
        status: status,
     }
    });
    res.status(200).json(updatedTask);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: `An error occurred while updating tasks.${err.message}` });
  }
};


export const getUserTasks = async (req: Request, res: Response): Promise<void> => {
  const { userId } = req.params;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { authorUserId: Number(userId) },
          { assignedUserId: Number(userId) },
        ]
      },
      include: {
        author: true,
        assignee: true,
      },
    });
    res.status(200).json(tasks);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: `An error occurred while users tasks.${err.message}` });
  }
};


export const deleteTask = async (req: Request, res: Response) : Promise<any> => {
  const { taskId } = req.body;
  try{
    const deleted_task=  await prisma.task.delete({
      where: {
        id: Number(taskId)
      }
    })
    res.status(200).json({success: true, message: `Task deleted successfully ${deleted_task.id}`});
  }
  catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: `An error occurred while deleting task.${err.message}` });
  }
}