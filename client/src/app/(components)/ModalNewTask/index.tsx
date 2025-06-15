import {
  Priority,
  Status,
  useCreateProjectMutation,
  useCreateTaskMutation,
} from "@/state/api";
import React from "react";
import Modal from "../../(components)/Modal";
import { formatISO } from "date-fns";
import { Snackbar } from "@mui/material";
import {Alert} from "@mui/material";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ id = null, isOpen, onClose }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [status, setStatus] = React.useState<Status>(Status.ToDo);
  const [description, setDescription] = React.useState("");
  const [priority, setPriority] = React.useState<Priority>(Priority.Backlog);
  const [tags, setTags] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [authorUserId, setAuthorUserId] = React.useState("");
  const [assignedUserId, setAssignedUserId] = React.useState("");
  const [projectId, setProjectId] = React.useState("")
  const handleSubmit = async () => {
    if (!title || !authorUserId || !(id !== null || projectId) ) {
      alert("Please fill all the fields");
      return;
    }
    const formattedStartDate = formatISO(new Date(startDate), {
      representation: "complete",
    });
    const formattedDueDate = formatISO(new Date(dueDate), {
      representation: "complete",
    });
    const res = await createTask({
      title,
      description,
      status,
      priority,
      startDate: formattedStartDate,
      dueDate: formattedDueDate,
      tags,
      authorUserId: parseInt(authorUserId),
      assignedUserId: parseInt(assignedUserId),
      projectId: id !== null ? Number(id) : Number(projectId),
    });
    if(res){
    setSnackbarOpen(true);
    setTitle("");
    setDescription("");
    setStatus(Status.ToDo);
    setPriority(Priority.Backlog);
    setTags("");
    setStartDate("");
    setDueDate("");
    setAuthor("");
    setAuthorUserId("");
    setAssignedUserId("");
    setProjectId("");
    //  onClose();
    }

  };

  const isFormValid = () => {
    return title && authorUserId && (id !== null || projectId);

  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-teritary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none ";
  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
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
            Task created successfully!
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
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) =>
              setStatus(Status[e.target.value as keyof typeof Status])
            }
          >
            <option value="">Select Status</option>
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>In Progress</option>
            <option value={Status.UnderReview}>UnderReview</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(Priority[e.target.value as keyof typeof Priority])
            }
          >
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          className={inputStyles}
          type="text"
          value={tags}
          placeholder="Tags (comma separated)"
          onChange={(e) => setTags(e.target.value)}
        />
        <div>
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            className={inputStyles}
            placeholder="Start Date"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date</label>
          <input
            type="date"
            value={dueDate}
            className={inputStyles}
            placeholder="Due Date"
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <input
          className={inputStyles}
          type="text"
          value={authorUserId}
          placeholder="Author User ID"
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        <input
          className={inputStyles}
          type="text"
          value={assignedUserId}
          placeholder="Assigned User ID"
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        {id === null && (
           <input
          className={inputStyles}
          type="text"
          value={projectId}
          placeholder="Project ID"
          onChange={(e) => setProjectId(e.target.value)}
        />
        )}
        <button
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary py-2 text-base font-medium text-white shadow-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-600 ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : " "}`}
          type="submit"
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTask;
