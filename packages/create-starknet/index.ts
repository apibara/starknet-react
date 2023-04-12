#!/usr/bin/env node

import path from 'path'
import prompts from 'prompts'
import fs from 'fs-extra'
import { Command, Option } from 'commander'
import chalk from 'chalk'

import createStarknetPackageJson from './package.json'
import { getPackageNameValidation } from './helpers/validate'
import { PackageManager, getPackageManager } from './helpers/packageManager'

const handleSigTerm = () => process.exit(0)

process.on('SIGINT', handleSigTerm)
process.on('SIGTERM', handleSigTerm)

const templatesFolderPath = path.join(__dirname, '..', 'templates')

let projectPath = ''
let selectedTemplate = ''
let packageManager: PackageManager | null = null

const templateNameToFolder = [
  ['Next.js', 'next'],
  ['Vite (React)', 'vite'],
]

const program = new Command()

program
  .name(createStarknetPackageJson.name)
  .description(createStarknetPackageJson.description)
  .version(createStarknetPackageJson.version)
  .arguments('[project-directory]')
  .usage('[project-directory] [options]')

  .addOption(
    new Option(
      '-t, --template <name>',
      'Explicitly tell the CLI to bootstrap the app using the specified template'
    ).choices(templateNameToFolder.map(([_, templateFolderName]) => templateFolderName))
  )
  .addOption(new Option('--use-npm', 'Explicitly tell the CLI to bootstrap the app using npm'))
  .addOption(new Option('--use-yarn', 'Explicitly tell the CLI to bootstrap the app using yarn'))
  .addOption(new Option('--use-pnpm', 'Explicitly tell the CLI to bootstrap the app using pnpm'))
  .action((projectDirectory, options) => {
    if (projectDirectory) {
      projectPath = projectDirectory
    }
    if (options.template) {
      selectedTemplate = options.template
    }
    if (options.useNpm) {
      packageManager = 'npm'
    }
    if (options.usePnpm) {
      packageManager = 'pnpm'
    }
    if (options.useYarn) {
      packageManager = 'yarn'
    }
  })
  .showHelpAfterError('(add --help for additional information)')

program.parse(process.argv)

async function run() {
  // If the project directory has already been precised in the arguments
  if (projectPath.length > 0) {
    const validation = getPackageNameValidation(projectPath)
    if (validation !== true) {
      console.error(
        `Could not create a project called ${chalk.red(
          path.basename(path.resolve(projectPath))
        )}\n${validation}`
      )
      return
    }
  } else {
    const response = await prompts({
      initial: 'my-starknet-app',
      type: 'text',
      name: 'projectPath',
      message: 'What is your project named?',
      validate: getPackageNameValidation,
    })

    if (typeof response.projectPath === 'string') {
      projectPath = response.projectPath.trim()
    }
  }

  const resolvedProjectPath = path.resolve(projectPath)
  const projectName = path.basename(resolvedProjectPath)

  // If the project template has not already been selected with the options
  if (selectedTemplate.length === 0) {
    const response = await prompts({
      initial: 0,
      type: 'select',
      name: 'framework',
      message: 'What framework would you like to use?',
      choices: templateNameToFolder.map(([templateName, templateFolderName]) => ({
        title: templateName,
        value: templateFolderName,
      })),
    })

    selectedTemplate = response.framework
  }

  // If the project package manager has not been defined with the options
  if (packageManager === null) {
    packageManager = getPackageManager()
  }

  const selectedTemplatePath = path.join(templatesFolderPath, selectedTemplate)

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

  console.log(`Success! Created ${projectName} at ${chalk.green(resolvedProjectPath)}\n`)
  console.log('We suggest that you begin by typing:\n')
  console.log(`    ${chalk.cyan('cd')} ${projectName}`)
  // TODO: Automatically install dependencies with the proper package manager
  console.log(`    ${chalk.cyan(`${packageManager} install`)}`)
  console.log(
    `    ${chalk.cyan(`${packageManager} ${packageManager === 'yarn' ? '' : 'run '}dev`)}`
  )
}

run()
  .then(() => process.exit(0))
  .catch(console.error)
