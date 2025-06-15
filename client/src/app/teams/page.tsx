"use client";
import { useGetTeamsQuery,  } from "@/state/api";
import React from "react";
import { useAppSelector } from "../redux";
import Header from "../(components)/Header";
import { DataGrid, GridColDef, GridToolbarContainer, GridToolbarExport, GridToolbarFilterButton } from "@mui/x-data-grid";
import { dataGridClassNames } from "@/lib/utils";
import { dataGridSxStyles } from "../../lib/utils";

const customToolbar = () => (
    <GridToolbarContainer className="toolbar flex gap-2 ">
        <GridToolbarFilterButton />
        <GridToolbarExport />
    </GridToolbarContainer>
)

const columns: GridColDef[] = [
  { field: "id", headerName: "Team ID", width: 100 },
  { field: "teamName", headerName: "Team Name", width: 150 },
  { field: "productOwnerUserName", headerName: "Product Owner", width: 200 },
  { field: "projectManagerUserName", headerName: "Project Manager", width: 200 },

];

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading teams</div>;
  return (
    <div className="flex w-full flex-col p-8">
      <Header name="Teams" />
      <div
        style={{
          height: 650,
          width: "100%",
        }}
      >
        <DataGrid
          rows={teams || []}
          columns={columns}
          pagination
          slots={{
            toolbar: customToolbar
          }}
          className={dataGridClassNames}
          sx={dataGridSxStyles(isDarkMode)}
        />
      </div>
    </div>
  );
};

export default Teams;
