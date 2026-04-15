import { EventEmitter } from "events";
import { read, add, write } from "../utils/storage.js";

const emitter = new EventEmitter();

const POSTS_FILE = "posts.json";
const USERS_FILE = "users.json";

emitter.on("allPosts", async (req, res) => {
  try {
    const posts = await read(POSTS_FILE);

    res.statusCode = 200;
    res.end(JSON.stringify(posts));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

emitter.on("createPost", async (req, res) => {
  try {
    const { userId, title, content } = req.body;

    if (!userId || !title || !content) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "All fields required" }));
    }

    const users = await read(USERS_FILE);
    const userExists = users.find((u) => u.id == userId);

    if (!userExists) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    const post = {
      id: Date.now(),
      userId,
      title,
      content,
      createdAt: new Date().toISOString(),
    };

    await add(POSTS_FILE, post);

    res.statusCode = 201;
    res.end(JSON.stringify(post));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

emitter.on("deletePost", async (req, res) => {
  try {
    const { id } = req.query;

    const posts = await read(POSTS_FILE);

    const index = posts.findIndex((p) => p.id == id);

    if (index === -1) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "Post not found" }));
    }

    posts.splice(index, 1);

    await write(POSTS_FILE, posts);

    res.statusCode = 200;
    res.end(JSON.stringify({ deleted: true }));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

export default emitter;
