"use client";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Icon,
  Layers,
  LockIcon,
  LucideIcon,
  OptionIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import Link from "next/link";
import { useGetProjectsQuery } from "@/state/api";
import { MoreVertical } from "lucide-react";
import { useDeleteProjectMutation } from "@/state/api";
import Snackbar from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(false);
  const [showPriority, setShowPriority] = useState(true);
  const { data: projects } = useGetProjectsQuery();
  const [deleteProject] = useDeleteProjectMutation();
  const [snackOpen, setSnackOpen] = useState(false);
  const dispatch = useDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(Number(projectId)).unwrap();
      setSnackOpen(true);
      console.log("Project deleted successfully");
    } catch (err) {

      console.log("Error deleting project:", err);
    }
  };



  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
  transition-all duration-300 h-full z-40 dark:bg-black overflow-y-auto bg-white 
  ${isSidebarCollapsed ? "w-0 " : "w-64"}

   `;
  return (
    <div className={sidebarClassNames}>
      {snackOpen && (
         <Snackbar open={true} autoHideDuration={3000} onClose={() => setSnackOpen(false)} >
            <Alert severity="success" variant="filled" onClose={() => setSnackOpen(false)}>
              The project has been deleted successfully. Refresh the page to see
              the changes.
            </Alert>
          </Snackbar>
)}
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] justify-between bg-white px-6 py-6 dark:bg-black">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            EDLIST
          </div>
          {isSidebarCollapsed ? null : (
            <button
              onClick={() =>
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))
              }
            >
              <X className="h-6 w-6 cursor-pointer text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        {/* Team */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src={"/logo.png"} alt="logo" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              EDTeam
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500 hover:cursor-pointer">
                Private
              </p>
            </div>
          </div>
        </div>
        {/* sidebar links */}
        <nav className="z-10 w-full">
          <SidebarLink icon={Home} label={"Home"} href="/" />
          <SidebarLink icon={Briefcase} label={"Timeline"} href="/timeline" />
          <SidebarLink icon={Search} label={"Search"} href="/search" />
          <SidebarLink icon={Settings} label={"Settings"} href="/settings" />
          <SidebarLink icon={User} label={"Users"} href="/users" />
          <SidebarLink icon={Users} label={"Teams"} href="/teams" />
        </nav>
        <button
          onClick={() => setShowProjects((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Projects</span>
          {showProjects ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {/* List projects */}
        {showProjects &&
          projects?.map((project) => (
            <div className="flex flex-row items-center" key={project.id}>
              <SidebarLink
                key={project.id}
                icon={Briefcase}
                label={project.name}
                href={`/projects/${project.id}`}
                isCollapsed={isSidebarCollapsed}
              />
              {/* <EllipsisVertical
            onClick={() => setOptionsOpen((prev) => !prev)}
            className="absolute right-2 top-3 h-4 w-4 text-gray-500 hover:cursor-pointer hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" /> */}
              <ProjectOptionsMenu
                onDelete={() =>{ 
                  handleDeleteProject(String(project.id))
                  
                }
                }
              />
            </div>
          ))}

        {/* priorities list */}
        <button
          onClick={() => setShowPriority((prev) => !prev)}
          className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
        >
          <span className="">Priorities</span>
          {showPriority ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </button>
        {showPriority && (
          <>
            <SidebarLink
              icon={AlertCircle}
              label={"Urgent"}
              href="/priority/urgent"
            />{" "}
            <SidebarLink
              icon={ShieldAlert}
              label={"High"}
              href="/priority/high"
            />{" "}
            <SidebarLink
              icon={AlertTriangle}
              label={"Medium"}
              href="/priority/medium"
            />{" "}
            <SidebarLink
              icon={AlertOctagon}
              label={"Low"}
              href="/priority/low"
            />{" "}
            <SidebarLink
              icon={Layers}
              label={"Backlog"}
              href="/priority/backlog"
            />
          </>
        )}
      </div>
    </div>
  );
};

const ProjectOptionsMenu = ({ onDelete }: { onDelete: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded p-2 "
        aria-label="Project options"
      >
        <MoreVertical className="h-5 w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 rounded border bg-white shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100"
          >
            Delete Project
          </button>
        </div>
      )}
    </div>
  );
};

interface sidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isCollapsed?: boolean;
}

const SidebarLink = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: sidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");
  const screenWidth = window.innerWidth;

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 text-white transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${isActive ? "bg-gray text-white dark:bg-gray-600" : ""} justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] bg-blue-200"></div>
        )}

        <Icon className="h-6 w-6 text-gray-800 dark:text-gray-100" />
        <span className={`font-medium text-gray-800 dark:text-gray-100`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
