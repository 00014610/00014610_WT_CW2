const { Router } = require("express");
const { uuid } = require("uuidv4"); // library, help to create unic id
const multer = require("multer"); // library which  help to upload images
const fs = require("fs");
const path = require("path");

const router = new Router();

//home page
router.get("/", (req, res) => {
	res.render("home");
});

//generate page
router.get("/generate", (req, res) => {
	res.render("generate");
});
