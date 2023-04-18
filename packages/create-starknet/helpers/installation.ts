import path from 'path'
import fs from 'fs-extra'

export type Template = 'next' | 'vite'

export function installTemplate(
  selectedTemplate: Template | null,
  resolvedProjectPath: string,
  projectName: string
) {
  if (selectedTemplate === null) {
    // Should never happen
    throw new Error('A template should be selected')
  }

  const templatesFolderPath = path.join(__dirname, '../..', 'templates')

  const selectedTemplatePath = path.join(templatesFolderPath, selectedTemplate)

  fs.copySync(selectedTemplatePath, resolvedProjectPath, { overwrite: false })

  const FILES_TO_RENAME = [
    ['gitignore', '.gitignore'],
    ['eslintrc.json', '.eslintrc.json'],
    ['README-template.md', 'README.md'],
  ]

  FILES_TO_RENAME.forEach(([previousFileName, newFileName]) => {
    const previousFilePath = path.join(resolvedProjectPath, previousFileName)
    const newFilePath = path.join(resolvedProjectPath, newFileName)

    if (fs.existsSync(previousFilePath)) {
      fs.renameSync(previousFilePath, newFilePath)
    }
  })

  const packageJsonPath = path.join(resolvedProjectPath, 'package.json')
  const packageJson = fs.readJsonSync(packageJsonPath)
  packageJson.name = projectName

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))
}
