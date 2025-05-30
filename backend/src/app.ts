import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

// middleware
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());

// route handlers
app.use("/api/v1");
