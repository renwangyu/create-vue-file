const fs = require('fs');
const path = require('path');
const program = require('commander');
const ejs = require('ejs');
const pkg = require('./package.json');
const common = require('./common');
const output = require('./ouput');
const { clearLine, createComponentName, createClassName, createDirName, createFileName } = common;

const CWD_PATH = process.cwd();
const CURRENT_PATH = path.resolve(CWD_PATH, './');

function write(path, code) {
  const file = fs.openSync(path, 'w');
  fs.writeSync(file, clearLine(code));
}

function getOpts(name = '', cmd = {}) {
  return Object.assign({ name }, cmd);
}

function getTemplateFile(template) {
  const ejsFile = path.resolve(__dirname, `./templates/vue/${template}.ejs`);
  if (fs.existsSync(ejsFile)) {
    return ejsFile;
  }
  return path.resolve(__dirname, './templates/vue/default.ejs');
}

function getRenderCfg(opts) {
  const className = createClassName(opts);
  const fileName = createFileName(opts, 'vue');
  const dirName = createDirName(opts);
  const compName = createComponentName(opts);
  const { functional = false } = opts;
  return {
    fileName,
    dirName,
    className,
    compName,
    isFunctional: functional,
  };
}

function createDir(opts) {
  const dirName = createDirName(opts);
  const dirPath = `${CURRENT_PATH}/${dirName}`;
  if (fs.existsSync(dirPath)) {
    output.error(`${dirPath} is already exist! remove first`);
    process.exit();
  }
  fs.mkdirSync(dirPath);
  return {
    dirName,
    dirPath,
  };
}

function createFile(opts, writePath = '') {
  const renderCfg = getRenderCfg(opts);
  const { template = '' } = opts;
  const tp = getTemplateFile(template);
  ejs.renderFile(tp, renderCfg, function (err, data) {
    if (err) {
      output.error(err);
    } else {
      const file = `${writePath ? writePath : CURRENT_PATH}/${renderCfg.fileName}`;
      if (fs.existsSync(file)) {
        output.error(`${file} is already exist! remove first`);
        process.exit();
      }
      write(file, data);
    }
  })
}

function createIndexFile(opts, writePath) {
  const renderCfg = getRenderCfg(opts);
  const indexFile = path.resolve(__dirname, './templates/common/index.ejs')
  ejs.renderFile(indexFile, renderCfg, function (err, data) {
    if (err) {
      output.error(err);
    } else {
      const file = `${writePath}/index.js`;
      if (fs.existsSync(file)) {
        output.error(`${file} is already exist! remove first`);
        process.exit();
      }
      write(file, data);
    }
  })
}

function createDirFile(opts) {
  const { dirPath } = createDir(opts);
  const writePath = path.resolve(dirPath, './');
  createFile(opts, writePath);
  createIndexFile(opts, writePath);
}

function run(name = '', cmd = {}) {
  const opts = getOpts(name, cmd);
  const { single } = opts;
  if (single) { // 只创建文件
    createFile(opts);
  }
  if (!single) {
    createDirFile(opts);
  }
  output.success('create success');
}

/*处理异常*/
process.on('uncaughtException', function (e) {
  output.error(e.message);
});

program
  .version(pkg.version)
  .name(pkg.name)
  .arguments('<name>')
  .option('-t, --template <template>', 'file template')
  .option('-x, --ext <ext>', 'file ext name')
  .option('-f, --functional', 'create functional component')
  .option('-p, --page', 'create page component')
  .option('-s, --single', 'only create component vue')
  .action(run)
  .parse(process.argv);