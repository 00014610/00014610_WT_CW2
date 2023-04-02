const express = require("express");
const app = express();
const path = require("path");
const routes = require("./public/routes");

app.set("view engine", "pug");
app.use("/static", express.static("public"));
app.use("public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

const PORT = 3500;

app.use(routes);

app.listen(PORT, (err) => {
	if (err) console.log(err);
	console.log(`server is running on port ${PORT}`);
});
