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

// Uploaded Image function
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "public/uploads/");
	},

	filename: (req, file, cb) => {
		cb(
			null,
			`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
		);
	},
});

let upload = multer({
	limits: {
		fileSize: 10000000, //overall 5 MB
	},
	fileFilter(req, file, cb) {
		if (!file.originalname.match(/\.(jpg|jpeg|png|JPG|JPEG|PNG)$/)) {
			return cb(new Error("Please upload a valid image file"));
		}

		cb(undefined, true);
	},
	storage: storage,
});

// Creating Post function
router.post("/generate", upload.single("image"), (req, res) => {
	const { post_name, date, content } = req.body;
	if (post_name && date && content) {
		fs.readFile("./data/posts.json", (err, data) => {
			if (err) throw err;
			const post = JSON.parse(data);
			post.unshift({
				id: uuid(),
				post_name,
				date,
				image: req?.file?.filename,
				content,
			});
			const postsJson = JSON.stringify(post);
			fs.writeFile("./data/posts.json", postsJson, (err) => {
				if (err) throw err;
				res.render("generate", { generated: true });
			});
		});
	} else {
		res.render("generate", {
			post_name,
			date,
			content,
		});
	}
});

// Taking function for updating informations
router.get("/generate/:id", (req, res) => {
	const singlePostId = req.params.id;
	fs.readFile("./data/posts.json", (err, data) => {
		if (err) throw err;
		const posts = JSON.parse(data);
		const singlePost = posts.find((post) => post.id == singlePostId);
		res.render("generate", {
			post: singlePost,
			update: true,
		});
	});
});

router.post("/generate/:id", upload.single("image"), (req, res) => {
	const singlePostId = req.params.id;
	const { post_name, date, content } = req.body;
	const image = req?.file?.filename;
	if (post_name && date && content) {
		fs.readFile("./data/posts.json", (err, data) => {
			if (err) throw err;
			const posts = JSON.parse(data);
			const persistPost = posts.filter((post) => post.id != singlePostId);
			const singlePost = posts.find((post) => post.id == singlePostId);
			persistPost.unshift({
				id: singlePostId,
				post_name,
				date,
				image: image ? image : singlePost.image,
				content,
			});
			const postsJson = JSON.stringify(persistPost);
			fs.writeFile("./data/posts.json", postsJson, (err) => {
				if (err) throw err;
				res.render("generate", { generated: true, alreadyUpdate: true });
			});
		});
	} else {
		res.render("generate", {
			post_name,
			date,
			content,
		});
	}
});

// All Information Page
router.get("/all-information", (req, res) => {
	fs.readFile("./data/posts.json", (err, data) => {
		if (err) throw err;
		const posts = JSON.parse(data);
		res.render("all-information", { posts: posts });
	});
}); // all-information page render && posts is sended from back-end to front-end

// Finding each post by id
router.get("/all-information/:id", (req, res) => {
	const id = req.params.id;
	fs.readFile("./data/posts.json", (err, data) => {
		if (err) throw err;
		const posts = JSON.parse(data);
		const singlePost = posts.find((elem) => elem.id == id);
		res.render("single-post", { singlePost });
	});
});

//Deleted method
router.get("/:id/delete", (req, res) => {
	const id = req.params.id;
	fs.readFile("./data/posts.json", (err, data) => {
		if (err) throw err;
		const posts = JSON.parse(data);
		const remainPosts = posts.filter((elem) => elem.id != id);
		const deletedPost = posts.find((post) => post.id == id);
		const postsStringify = JSON.stringify(remainPosts);
		fs.writeFile("./data/posts.json", postsStringify, (err) => {
			if (err) throw err;
			if (deletedPost?.image) {
				fs.unlink(`public/uploads/${deletedPost?.image}`, (err) => {
					if (err) throw err;
					console.log("Successfully Deleted ");
				});
			}
			res.render("all-information", { posts: remainPosts, delete: true });
		});
	});
});

router.get("/api/v1/all-information", (req, res) => {
	fs.readFile("./data/posts.json", (err, data) => {
		if (err) throw err;
		const posts = JSON.parse(data);
		res.json(posts);
	});
});

module.exports = router;
