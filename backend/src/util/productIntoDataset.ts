import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

const productIntoDataset = async (product: any): Promise<void> => {
  const scriptPath = path.join(__dirname, "../model/productIntoDataset.py");
  const csvPath = path.join(__dirname, "../model/data_with_new_eco_score.csv");

  try {
    const result: any = await execFileAsync("python3", [
      scriptPath,
      JSON.stringify(product),
      csvPath,
    ]);

    const parsed = JSON.parse(result.stdout);

    if (parsed.status) {
      console.log(`${product.code} product inserted into dataset`);
    } else {
      console.log(`${product.code} product already exists in dataset`);
    }
  } catch (error) {
    console.error("Python error while inserting product into dataset:", error);
  }
};

export default productIntoDataset;
