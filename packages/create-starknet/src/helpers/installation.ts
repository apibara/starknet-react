import path from "node:path";
import { fileURLToPath } from "node:url";
import spawn from "cross-spawn";
import fs from "fs-extra";
import type { PackageManager } from "./packageManager.ts";

export type Template = "next" | "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function installTemplate(
  selectedTemplate: Template | null,
  resolvedProjectPath: string,
  projectName: string,
) {
  if (selectedTemplate === null) {
    // Should never happen
    throw new Error("A template should be selected");
  }

  const templatesFolderPath = path.join(__dirname, "../src", "templates");
  const selectedTemplatePath = path.join(templatesFolderPath, selectedTemplate);

  fs.copySync(selectedTemplatePath, resolvedProjectPath, { overwrite: false });

  const FILES_TO_RENAME = [
    ["gitignore", ".gitignore"],
    ["eslintrc.json", ".eslintrc.json"],
    ["README-template.md", "README.md"],
  ];

  for (const [previousFileName, newFileName] of FILES_TO_RENAME) {
    const previousFilePath = path.join(resolvedProjectPath, previousFileName);
    const newFilePath = path.join(resolvedProjectPath, newFileName);

    if (fs.existsSync(previousFilePath)) {
      fs.renameSync(previousFilePath, newFilePath);
    }
  }

  const packageJsonPath = path.join(resolvedProjectPath, "package.json");
  const packageJson = fs.readJsonSync(packageJsonPath);
  packageJson.name = projectName;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

export async function installDependencies(
  packageManager: PackageManager,
  resolvedProjectPath: string,
) {
  console.log("Installing dependencies...");
  const args = [
    "install",
    packageManager === "yarn" ? "--cwd" : "--prefix",
    resolvedProjectPath,
    packageManager === "pnpm" ? "--quiet" : "--silent",
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(packageManager, args, {
      stdio: "inherit",
      env: {
        ...process.env,
        ADBLOCK: "1",
        NODE_ENV: "development",
        DISABLE_OPENCOLLECTIVE: "1",
      },
    });
    child.on("close", (code) => {
      if (code !== 0) {
        reject("Error·while·installing·dependencies");
        return;
      }
      resolve(true);
    });
  });
}
