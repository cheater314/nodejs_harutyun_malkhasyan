import fs from "fs/promises";

const DATA_DIR = "./data";

async function ensureFile(fileName) {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.access(`${DATA_DIR}/${fileName}`);
  } catch {
    await fs.writeFile(`${DATA_DIR}/${fileName}`, "[]");
  }
}

export async function read(fileName) {
  try {
    await ensureFile(fileName);
    const data = await fs.readFile(`${DATA_DIR}/${fileName}`, "utf-8");

    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  } catch {
    return [];
  }
}

export async function write(fileName, items) {
  await ensureFile(fileName);
  await fs.writeFile(`${DATA_DIR}/${fileName}`, JSON.stringify(items, null, 2));
}

export async function add(fileName, item) {
  const items = await read(fileName);
  items.push(item);
  await write(fileName, items);
  return item;
}
