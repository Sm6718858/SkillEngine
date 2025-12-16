import express from "express";
import { submitSolution } from "../Controller/submissionController.js";
import {fetchProblems} from '../Controller/problemsController.js'

const router = express.Router();

router.get('/getProblems',fetchProblems);
router.post("/submit", submitSolution);

export default router;
