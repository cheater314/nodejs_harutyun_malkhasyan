import { EventEmitter } from "events";
import { read, add } from "../utils/storage.js";

const emitter = new EventEmitter();
const USERS_FILE = "users.json";

emitter.on("login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await read(USERS_FILE);

    const user = users.find(
      (u) => u.email === email && u.password === password,
    );

    if (!user) {
      res.statusCode = 401;
      return res.end(JSON.stringify({ error: "Invalid credentials" }));
    }

    const { password: _, ...safeUser } = user;

    res.statusCode = 200;
    res.end(JSON.stringify(safeUser));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

emitter.on("register", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "All fields required" }));
    }

    const users = await read(USERS_FILE);

    const exists = users.find((u) => u.email === email);
    if (exists) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Email already exists" }));
    }

    const newUser = {
      id: Date.now(),
      email,
      password,
      name,
    };

    await add(USERS_FILE, newUser);

    const { password: _, ...safeUser } = newUser;

    res.statusCode = 201;
    res.end(JSON.stringify(safeUser));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

emitter.on("profile", async (req, res) => {
  try {
    const { id } = req.query;

    const users = await read(USERS_FILE);

    const user = users.find((u) => u.id == id);

    if (!user) {
      res.statusCode = 404;
      return res.end(JSON.stringify({ error: "User not found" }));
    }

    const { password: _, ...safeUser } = user;

    res.statusCode = 200;
    res.end(JSON.stringify(safeUser));
  } catch (e) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: e.message }));
  }
});

export default emitter;
