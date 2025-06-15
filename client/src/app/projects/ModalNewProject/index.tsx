import { useCreateProjectMutation } from "@/state/api";
import React from "react";
import Modal from "../../(components)/Modal";
import { formatISO } from "date-fns";
import Snackbar from '@mui/material/Snackbar';
import { Alert } from "@mui/material";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewProject = ({ isOpen, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const [projectName, setProjectName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [snackOpen, setSnackOpen] = React.useState(false);

  const handleSubmit = async () => {
    if (!projectName || !startDate || !endDate) {
      alert("Please fill all the fields");
      return;
    }
    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedEndDate = formatISO(new Date(endDate), {
      representation: "complete",
    });
const res =  await createProject({
      name: projectName,
      description,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
  if(res.data){
      setSnackOpen(true);
    onClose();
    setProjectName("");
    setDescription("");
    setStartDate("");
    setEndDate("");
  }

    else{
      // @ts-ignore
      alert(res.error?.data?.message);
    }
  
  };

  const isFormValid = () => {
    return projectName && startDate && endDate;
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-teritary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none ";
  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Project">
      {snackOpen && (
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackOpen}
          autoHideDuration={6000}
          onClose={() => setSnackOpen(false)}
        >
          <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: '100%' }}>
            Project created successfully!
          </Alert>
        </Snackbar>
      )}
      <form
        className="mt-4 space-y-6 p-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          className={inputStyles}
          type="text"
          value={projectName}
          placeholder="Project Name"
          onChange={(e) => setProjectName(e.target.value)}
        />
        <textarea
          className={inputStyles}
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label >Start Date</label>
            <input
              type="date"
              value={startDate}
              className={inputStyles}
              placeholder="Start Date"
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label >End Date</label>
            <input
              type="date"
              value={endDate}
              className={inputStyles}
              placeholder="End Date"
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <button
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary py-2 text-base font-medium text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : " "}`}
          type="submit"
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Project"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewProject;
