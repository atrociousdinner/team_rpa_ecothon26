import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

const generateDescription = async (tags: string): Promise<any> => {

  const scriptPath = path.join(__dirname, "../model/generateDescription.py");

  try {
    const result: any = await execFileAsync("python3", [scriptPath, tags]);
    const parsed = JSON.parse(result.stdout);

    console.log("Description generated");

    return parsed.description;

  } catch (err) {
    console.error("Error in generating description:", err);
  }
};

export default generateDescription;
