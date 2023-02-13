#!/usr/bin/env node

import path from 'path'
import prompts from 'prompts'
import validatePackageName from 'validate-npm-package-name'
import fs from 'fs-extra'

const handleSigTerm = () => process.exit(0)

process.on('SIGINT', handleSigTerm)
process.on('SIGTERM', handleSigTerm)

const templatesFolderPath = path.join(__dirname, '..', 'templates')

let projectPath = ''

// TODO: Setup commander

async function run() {
  const response = await prompts({
    initial: 'my-starknet-app',
    type: 'text',
    name: 'projectPath',
    message: 'What is your project named?',
    validate: (projectPath) => {
      const projectNameValidation = validatePackageName(path.basename(path.resolve(projectPath)))

      if (!projectNameValidation.validForNewPackages) {
        return [
          ...(projectNameValidation.warnings || []),
          ...(projectNameValidation.errors || []),
        ].join('\n')
      }

      if (fs.existsSync(path.resolve(projectPath))) {
        return 'A file with this name already exists'
      }

      return true
    },
  })

  if (typeof response.projectPath === 'string') {
    projectPath = response.projectPath.trim()
  }

  const resolvedProjectPath = path.resolve(projectPath)
  const projectName = path.basename(resolvedProjectPath)

  // TODO: Pick the proper template
  const selectedTemplatePath = path.join(templatesFolderPath, 'next')

  fs.copySync(selectedTemplatePath, resolvedProjectPath, { overwrite: false })

  const filesToRename = [
    ['gitignore', '.gitignore'],
    ['eslintrc.json', '.eslintrc.json'],
    ['README-template.md', 'README.md'],
  ]

  filesToRename.forEach(([previousFileName, newFileName]) => {
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

run()
  .then(() => process.exit(0))
  .catch(console.error)
