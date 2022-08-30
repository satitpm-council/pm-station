import path from "path";
import fs from "fs";
import { readFile, writeFile, unlink } from "fs/promises";

export default class FileSystemCache<T extends Record<string, any>> {
  private dir: string;
  constructor(dir: string) {
    this.dir = path.join(process.cwd(), ".cache", dir);
  }
  async get(name: string): Promise<T | undefined> {
    if (!fs.existsSync(this.dir)) fs.mkdirSync(this.dir);
    try {
      return JSON.parse(
        await readFile(this.fileName(name), {
          encoding: "utf-8",
        })
      );
    } catch {
      return undefined;
    }
  }
  private fileName(name: string) {
    return path.join(this.dir, `${name.replace(/\//g, "_")}.json`);
  }
  async set(name: string, data: T) {
    return writeFile(this.fileName(name), JSON.stringify(data));
  }
  async delete(name: string) {
    return unlink(this.fileName(name));
  }
}
