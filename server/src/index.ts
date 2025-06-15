import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { projectRoutes } from "./routes/projectRoutes";
import { taskRoutes } from "./routes/taskRoutes";
import { searchRoutes } from "./routes/searchRoutes";
import { userRoutes } from "./routes/userRoutes";
import { teamRoutes } from "./routes/teamRoutes"; // Importing team routes

// route imports

// configs
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("common"));
app.use(cors());

// routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);
app.use("/search", searchRoutes);
app.use("/users", userRoutes);
app.use("/teams", teamRoutes);
// server
const port = Number(process.env.PORT || 5000);

app.listen(port,"0.0.0.0" ,() => {
  console.log(`Server is running on port ${port}`);
});
