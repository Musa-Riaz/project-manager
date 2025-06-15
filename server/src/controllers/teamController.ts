import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getTeams = async (req: Request, res: Response): Promise<void> => {
  const { projectId } = req.query;

  try {
const teams = await prisma.team.findMany();
const teamsWithUsername = await Promise.all(
  teams.map(async (team: any) => {
    const productOwner = team.productOwnerUserId
      ? await prisma.user.findUnique({
          where: { userId: team.productOwnerUserId },
          select: { username: true },
        })
      : null;

    const projectManager = team.projectManagerUserId
      ? await prisma.user.findUnique({
          where: { userId: team.projectManagerUserId },
          select: { username: true },
        })
      : null;

    return {
      ...team,
      productOwnerUsername: productOwner?.username || null,
      projectManagerUsername: projectManager?.username || null,
    };
  })
);

res.json(teamsWithUsername);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ error: `An error occurred while fetching teams.${err.message}` });
  }
};