import React from "react";
import { useDeleteTaskMutation, useGetTasksQuery, useUpdateTaskStatusMutation } from "@/state/api";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Task as TaskType } from "@/state/api";
import { useDrop } from "react-dnd";
import { EllipsisVertical, MessageSquareMore, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { Snackbar } from "@mui/material";
import {Alert} from "@mui/material";

type BoardProps = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const BoardView = ({ id, setIsModalNewTaskOpen }: BoardProps) => {
  const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];
  const {
    data: tasks,
    isLoading,
    error,
  } = useGetTasksQuery({ projectId: Number(id) });
  const [updateTaskStatus] = useUpdateTaskStatusMutation();


  const moveTask = (taskId: number, toStatus: string) => {
    updateTaskStatus({ taskId, status: toStatus });
    if (isLoading) return <div>Loading...</div>;
    if (error) {
      return <div>An error occured while fetching tasks</div>;
    }
  };

  
  

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {taskStatus.map((status) => (
          <TaskColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={moveTask}
            setIsModalNewTaskOpen={setIsModalNewTaskOpen}
          />
        ))}
      </div>
    </DndProvider>
  );
};

type TaskColumnProps = {
  status: string;
  tasks: TaskType[];
  moveTask: (taskId: number, toStatus: string) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const TaskColumn = ({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: TaskColumnProps) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const taskCount = tasks.filter((task) => task.status === status).length;
  

  const statusColor: any = {
    "To Do": "#2563eb",
    "Work In Progress": "#059669",
    "Under Review": "#d97706",
    "Completed": "#000",
  };

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [deleteTask] = useDeleteTaskMutation();
  const handleDeleteTask = async (taskId: number) => {
  await deleteTask(taskId).unwrap();
  setSnackbarOpen(true);
  window.location.reload(); // Reload the page to reflect changes
}
  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      {snackbarOpen && (
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={3000}
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            Task deleted successfully!
          </Alert>
        </Snackbar>
      )}
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
          <h3 className="flex items-center text-lg font-semibold dark:text-white">
            {status}{" "}
            <span
              className="ml-2 inline-block rounded-full bg-gray-200 p-1 text-center text-sm leading-none"
              style={{
                width: "1.5rem",
                height: "1.5rem",
              }}
            >
              {taskCount}
            </span>
          </h3>
          <div className="flex items-center gap-1">
            <button className="dark:text-netural-500 flex h-6 w-5 items-center justify-center"  >
              {/* <EllipsisVertical size={26} /> */}
            </button>
            <button
              className="flex h-6 w-6 items-center justify-center rounded bg-gray-200 dark:bg-dark-tertiary dark:text-white"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <Task key={task.id} task={task} deleteTask={handleDeleteTask} />
        ))}
    </div>
  );
};




const ProjectOptionsMenu = ({ onDelete }: { onDelete: () => void }) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="rounded p-2 "
        aria-label="Project options"
      >
        <EllipsisVertical className="h-5 w-5 text-gray-500 hover:cursor-pointer hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-32 rounded  bg-red-500 shadow-lg">
          <button
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
            className="block w-full px-4 py-2 text-left text-white hover:bg-red-300"
          >
            {/* <Trash2 className="inline mr-2" /> */}
            Delete Task
          </button>
        </div>
      )}
    </div>
  );
};



type taskProps = {
  task: TaskType;
  deleteTask?: (taskId: number) => void;
};

const Task = ({ task, deleteTask }: taskProps) => {
   
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagSplit = task.tags ? task.tags.split(",") : [];
  const formattedStartDate = task.startDate
    ? format(new Date(task.startDate), "P")
    : "";
  const formattedDueDate = task.dueDate
    ? format(new Date(task.dueDate), "P")
    : "";
  const numberOfComments = (task.comments && task.comments.length) || 0;

  const PriorityTag = ({ priority }: { priority: TaskType["priority"] }) => (
    <div
      className={`rounded-full px-2 py-1 text-xs font-semibold ${priority === "Urgent" ? "bg-red-200 text-red-700" : priority === "High" ? "bg-yellow-200 text-yellow-700" : priority === "Medium" ? "bg-green-200 text-green-700" : priority === "Low" ? "bg-blue-200 text-blue-700" : "bg-gray-200 text-gray-700"} `}
    >
      {priority}
    </div>
  );
   const [isCommenetOpen, setIsCommentOpen] = React.useState(false);
  return (
    <div
      ref={(instnace) => {
        drag(instnace);
      }}
      className={`mb-4 rounded-md bg-white shadow dark:bg-dark-secondary ${
        isDragging ? "opacity-50" : "opacity-100"
      } `}
    >
      {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          height={200}
          width={400}
          className="h-auto w-full rounded-t-md"
        />
      )}
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-2">
            {task.priority && <PriorityTag priority={task.priority} />}
            <div className="flex gap-2">
              {taskTagSplit.map((tag, index) => (
                <div
                  key={index}
                  className="text-sx rounded-full bg-blue-100 px-2 py-1"
                >
                  {" "}
                  {tag}
                </div>
              ))}
            </div>
          </div>
          <button className="flex h-6 w-4 flex-shrink-0 items-center justify-center dark:text-neutral-500">
            {/* <EllipsisVertical size={26} /> */}
            <ProjectOptionsMenu onDelete={() => deleteTask && deleteTask(task.id)} />
          </button>
        </div>
        <div className="my-3 flex justify-between">
          <h4 className="text-md font-bold dark:text-white">{task.title}</h4>
          {typeof task.points === "number" && (
            <div className="text-xs font-semibold dark:text-white">
              {task.points} Points
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Users */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex -space-x-[6px] overflow-hidden">
            {task.assignee && (
              <Image
                key={task.assignee.userId}
                src={`/${task.assignee.profilePictureUrl!}`}
                alt={task.assignee.username}
                height={30}
                width={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
            {task.author && (
              <Image
                key={task.author.userId}
                src={`/${task.author.profilePictureUrl!}`}
                alt={task.author.username}
                height={30}
                width={30}
                className="h-8 w-8 rounded-full border-2 border-white object-cover dark:border-dark-secondary"
              />
            )}
          </div>
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400"
            onClick={() => setIsCommentOpen(!isCommenetOpen)}
            >
              {numberOfComments} Comments
            </span>
          </div>
          
        </div>
        {/* Need to implement the comments feature in future */}
            {isCommenetOpen && numberOfComments > 0 && (
                <div>
                    <div className="mt-2 rounded-md bg-gray-100 p-3 dark:bg-dark-tertiary">
                        <p className="text-sm text-gray-600 dark:text-neutral-400">
                       {task?.comments?.map((comment) => (
                        <p key={comment.id}>{comment.text}</p>
                       ) )}
                        </p>
                    </div>
                </div>
            )}
      </div>
    </div>
  );
};

export default BoardView;
