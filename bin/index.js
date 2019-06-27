#!/usr/bin/env node
const program = require('commander')
const download = require('download-git-repo')
const inquirer = require('inquirer')
const handlebars = require('handlebars')
const ora = require('ora')
const chalk = require('chalk')
const symbols = require('log-symbols')
const fs = require('fs')
const shell = require('shelljs')

const defaultUrl = 'github:maoyonglong/rollup-lib-template#tmp'
let spinner = ora('downloading template...')

program
  .version('1.0.0')

program
  .command('init <name>')
  .option('-t --template <url>', '')
  .action(async function (name, options) {
    if (!fs.existsSync(name)) {
      const url = options.template || defaultUrl
      console.log(url)
      spinner.start()
      await dowloadTmp(url, name)
      spinner.succeed()
      const answers = await ask()
      const meta = { name, ...answers }
      const packageJsonName = `${name}/package.json`
      const devConfigName = `${name}/rollup.config.dev.js`
      const prodConfigName = `${name}/rollup.config.prod.js`
      injectFile(packageJsonName, meta)
      injectFile(devConfigName, meta)
      injectFile(prodConfigName, meta)
      console.log(symbols.success, chalk.green('Inject template successfully.'))
      spinner = ora('installing dependences...')
      spinner.start()
      await installDependences(name)
      spinner.stop()
      console.log(symbols.success, chalk.green('Build project finished.'))
    } else {
      console.log(symbols.error, chalk.red('The project has been existed.'))
    }
  })

program.parse(process.argv)

function injectFile (fileName, meta) {
  const content = fs.readFileSync(fileName).toString()
  const result = handlebars.compile(content)(meta)
  fs.writeFileSync(fileName, result)
}

function dowloadTmp (url, name) {
  return new Promise((resolve, reject) => {
    download(url, name, { clone: true }, (err) => {
      if (err) reject(err)
      resolve()
    })
  })
}

function ask () {
  return inquirer.prompt([
    {
      type: 'input',
      name: 'author',
      message: 'author: '
    },
    {
      type: 'input',
      name: 'description',
      message: 'description: '
    },
    {
      type: 'list',
      name: 'devFormat',
      message: 'the output format in development: ',
      choices: ['umd', 'iife', 'cjs', 'amd']
    },
    {
      type: 'list',
      name: 'prodFormat',
      message: 'the output format in production: ',
      choices: ['umd', 'iife', 'cjs', 'amd']
    },
    {
      type: 'input',
      name: 'expose',
      message: 'set the name of variable you want to expose: ',
      when (answers) {
        const exposeFormat = ['umd', 'iife']
        return exposeFormat.indexOf(answers.devFormat) >= 0 || exposeFormat.indexOf(answers.prodFormat) >= 0
      }
    },
    {
      type: 'input',
      name: 'fileName',
      message: `set the name of file (exclude extension): `
    }
  ])
}

function installDependences (name) {
  return new Promise((resolve) => {
    shell.cd(name)
    shell.exec('npm install', () => {
      resolve()
    })
  })
}
