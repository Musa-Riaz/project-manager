"use client";
import {
  useGetProjectsQuery,
  useGetTasksQuery,
  Task,
  Project,
  Priority,
} from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "../(components)/Header";
import {ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Cell,Pie, CartesianGrid} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";

const HomePage = () => {
  const COLORS = ["#0088f3", "#00c49f", "#ffbb2b", "ff8042"];
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({ projectId: parseInt("1") });
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (tasksLoading || isProjectsLoading) {
    return <div>Loading...</div>;
  }
  if (tasksError) {
    return <div>Error loading tasks</div>;
  }
  if (!tasks || !projects) {
    return <div>No tasks or projects found</div>;
  }

  const priorityCount = tasks.reduce(
    (acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    },
    {},
  );

  const taskDistribution = Object.keys(priorityCount).map((key) => ({
    name: key,
    count: priorityCount[key],
  }));

  const statusCount = projects.reduce(
    (acc: Record<string, number>, project: Project) => {
      const status = project.endDate ? "Completed" : "Active";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {},
  );

  const projectStatus = Object.keys(statusCount).map((key) => ({
    name: key,
    count: statusCount[key],
  }));
  const taskColumns: GridColDef[] = [
    { field: "title", headerName: "Title", width: 200 },
    { field: "status", headerName: "Status", width:450 },
    { field: "priority", headerName: "Priority", width: 150 },
    { field: "dueDate", headerName: "Due Date", width: 350 },
  ];

  const chartColors = isDarkMode
    ? {
        bar: "#8884d8",
        barGrid: "#303030",
        pieFill: "4a90e2",
        text: "#fff",
      }
    : {
        bar: "#8884d8",
        barGrid: "#e0e0e0",
        pieFill: "82ca9d",
        text: "#000",
      };
  return (
    <div className="container h-full w-[100%] bg-gray-100 bg-transparent p-8">
      <Header name="Project Management Dashboard" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Task Priority Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
        <BarChart data={taskDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke={chartColors.barGrid} />
            <XAxis dataKey="name" stroke={chartColors.text} />
            <YAxis stroke={chartColors.text} />
            <Tooltip contentStyle={{
                width:"min-content",
                height:"min-content",
            }} />
            <Legend />
                <Bar dataKey="count"  fill={chartColors.bar}/>
        </BarChart>
          </ResponsiveContainer>
        </div>

     <div className="rounded-lg  bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
        <PieChart data={taskDistribution}>
            <Pie
              data={projectStatus}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill={chartColors.pieFill}
              label >
                {projectStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
              </Pie>
            <Tooltip  />
            <Legend />
        </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

        <div className="rounded-lg mt-4 bg-white p-4 shadow dark:bg-dark-secondary">
          <h3 className="mb-4 text-lg font-semibold dark:text-white">
            Your Tasks
          </h3>
          <div style={{
            height:400,
            width:"100%",

          }}>
            <DataGrid 
            rows={tasks}
            columns={taskColumns}
            loading={tasksLoading}
            getRowClassName={() => "data-grid-row"}
            getCellClassName={() => "data-grid-cell"}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
            />
          </div>
          </div>
    </div>
  );
};

export default HomePage;
