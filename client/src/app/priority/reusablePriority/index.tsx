"use client";
import Header from "@/app/(components)/Header";
import ModalNewTask from "@/app/(components)/ModalNewTask";
import TaskCard from "@/app/(components)/TaskCard";
import { useAppSelector } from "@/app/redux";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { Priority, Task, useGetUserTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React, { useState } from "react";

type Props = {
  priority: Priority;
};


const columns: GridColDef[] = [
    {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params: any) => (
      <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
        {params.value}
        {console.log(params)}
      </span>
    ),
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  }, 
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params: any) => params.row?.author?.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params: any) => params.row?.assignee?.username || "Unassigned",
  },
]


const ReusablePriorityPage = ({ priority }: Props) => {
  const [view, setView] = useState("List");
  const [isModalNewTaskOpen, setIsModalNewTaskOpen] = useState(false);
  const userId = 1;
  const {
    data: tasks,
    isLoading,
    isError: isTaskError,
  } = useGetUserTasksQuery(userId || 0, {
    skip: userId === null,
  });
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const filteredTasks = tasks?.filter(
    (task: Task) => task.priority === priority,
  );

  if (isTaskError || !tasks) return <div>Error loading tasks</div>;
  return (
    <div className="m-5 p-4">
      <ModalNewTask
        isOpen={isModalNewTaskOpen}
        onClose={() => setIsModalNewTaskOpen(false)}
      />
      <Header
        name="Priority Page Management"
        buttonComponent={
          <button
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add Task
          </button>
        }
      />
      <div className="mb-4 felx jusitfy-start ">
            <button className={`px-4 py-2 ${
                view== "list" ? "bg-gray-300" : "bg-white"} rounded-l`}
                onClick={()=> setView("list")}
                >
                    List
            </button>
            <button className={`px-4 py-2 ${
                view== "table" ? "bg-gray-300" : "bg-white"} rounded-l`}
                onClick={()=> setView("table")}
                >
                    Table
            </button>
      </div>

      {isLoading ? (<div>Loading Tasks...</div>) : view ==="list" ? (
        <div className="grid grid-cols-1 gap-4">
{filteredTasks?.map((task: Task) => (
    <TaskCard  key={task.id} task={task}/>
))}
        </div>
      ) : (
        view === "table" && (
            <div className="w-full">
                    <DataGrid
                    rows={filteredTasks || []}
                    columns={columns}
                    checkboxSelection
                    getRowId = {(row) => row.id}
                    className={dataGridClassNames}
                    sx={dataGridSxStyles(isDarkMode)}
                    />
            </div>
        )
      )}
    </div>
  );
};

export default ReusablePriorityPage;
