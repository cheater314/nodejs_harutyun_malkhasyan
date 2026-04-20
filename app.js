import "dotenv/config";
import http from "http";

import usersEmitter from "./handlers/users.js";
import postsEmitter from "./handlers/posts.js";

import parser from "./utils/parser.js";
import { lstat } from "fs";

const { PORT } = process.env;
const server = http.createServer(async function (req, res) {
  try {
    const { method, url } = await parser(req);

    res.setHeader("Content-Type", "application/json");

    if (method === "POST" && url === "/login") {
      usersEmitter.emit("login", req, res);
      return;
    }

    if (method === "POST" && url === "/register") {
      usersEmitter.emit("register", req, res);
      return;
    }

    if (method === "GET" && url === "/profile") {
      usersEmitter.emit("profile", req, res);
      return;
    }

    if (method === "POST" && url === "/posts") {
      postsEmitter.emit("createPost", req, res);
      return;
    }

    if (method === "GET" && url === "/posts") {
      postsEmitter.emit("allPosts", req, res);
      return;
    }

    if (method === "DELETE" && url.startsWith("/posts")) {
      postsEmitter.emit("deletePost", req, res);
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ error: "Route not found" }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});


server.listen(PORT, () => {
  console.log(`server listening om port ${PORT}`);
});

function asap() {
  return;
}
asap();


function aabbb(){
  console.log("111")
}

aabbb()


