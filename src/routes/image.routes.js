import express from "express";
import { google } from "googleapis";
import * as ctrlImage from "../controllers/uploadImg";
import { Router } from "express";

const router = Router();

router.get("/", ctrlImage.getPrueba);
router.post("/post", ctrlImage.postImage);

export default router;


