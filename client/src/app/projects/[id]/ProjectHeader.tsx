import React from "react";
import { useState } from "react";
import Header from "@/app/(components)/Header";
import {
  Clock,
  Delete,
  Filter,
  Grid,
  Grid3X3,
  List,
  PlusSquare,
  Share,
  Share2,
  Table,
  Trash2,
} from "lucide-react";
import ModalNewProject from "../ModalNewProject";
import { useGetProjectByIdQuery, useDeleteProjectMutation } from "@/state/api";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";
import { useRouter } from "next/navigation";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  projectId?: string;
};



const ProjectHeader = ({ activeTab, setActiveTab, projectId }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);
  const {data: project, isLoading, error} = useGetProjectByIdQuery(Number(projectId));
  const [snackOpen, setSnackOpen] = useState(false);
  const [deleteProject] = useDeleteProjectMutation();
  const router = useRouter();

  const handleDeleteProject = async () => {
    try{
      await deleteProject(Number(projectId)).unwrap();
      
      setSnackOpen(true);
      router.push("/");

    }
    catch(err){
      setSnackOpen(false);
      console.error("Error deleting project:", err);
    }
}

  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="px-4 xl:px-6">
      {snackOpen && (
        <Snackbar
          open={snackOpen}
          autoHideDuration={6000}
          onClose={() => setSnackOpen(false)}
        >
          <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: '100%' }}>
            Project deleted successfully!
          </Alert>
        </Snackbar>
      )}
      {/* Modal new project */}
      <ModalNewProject
      isOpen={isModalNewProjectOpen}
      onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header name={"Product Design Development"} 
        
        buttonComponent={
          <button className="flex items-center rounded-md bg-blue-primary text-white px-3 py-2 hover:bg-blue-600"
          onClick={() => setIsModalNewProjectOpen(true)}
          >
              <PlusSquare className="mr-2 h-5 w-5" />
              New Project
          </button>
        }
        deleteButton={
          <button onClick={() => handleDeleteProject()} className="flex items-center rounded-md bg-red-500 text-white px-3 py-2 hover:bg-red-600">
            <Trash2 className="mr-2 h-5 w-5" />
            Delete Project
          </button>
        }
        />
      </div>
      {/* Project name and id */}
       <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {`Project Name: ${project?.name}`}
            </h1>
        </div>
      {/* Tabs */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-stroke-dark md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4">
          <TabButton
            name="Board"
            icon={<Grid3X3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="TimeLine"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Filter className="h-5 w-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-gray-300">
            <Share2 className="h-5 w-5" />
          </button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="rounded-md border py-1 pl-10 pt-4 focus:outline-none dark:border-dark-secondary dark:text-white"
            />
            <Grid className="absolute left-3 top-4 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;
  return (
    <button
      className={`affter:left-0 relative flex items-center gap-2 px-1 py-2 text-gray-500 after:absolute after:-bottom-[9px] after:h-[1px] after:w-full hover:text-blue-800 dark:text-neutral-500 dark:hover:text-white sm:px-2 lg:px-4 ${isActive ? "text-blue-600 after:bg-blue-600 dark:text-white" : ""} `}
      onClick={() => setActiveTab(name)}
    >
      {icon}
      {name}
    </button>
  );
};

export default ProjectHeader;
