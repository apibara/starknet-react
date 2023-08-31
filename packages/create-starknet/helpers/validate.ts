import path from "path";
import fs from "fs-extra";
import validateNpmPackageName from "validate-npm-package-name";

export function getPackageNameValidation(projectPath: string) {
  const projectNameValidation = validateNpmPackageName(
    path.basename(path.resolve(projectPath)),
  );

  if (!projectNameValidation.validForNewPackages) {
    return [
      ...(projectNameValidation.warnings || []),
      ...(projectNameValidation.errors || []),
    ].join("\n");
  }

  if (fs.existsSync(path.resolve(projectPath))) {
    return "A file with this name already exists";
  }

  return true;
}
