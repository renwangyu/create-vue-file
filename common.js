const changeCase = require('change-case');

function clearLine(code = '') {
  const res = code
    .replace(/\n+(DELETE_LINE{1,})\n/g, '\n')
    .replace(/DELETE_LINE/, '')
    .replace(/\n+(\s{1,})\n/g, '\n\n')
    .replace(/\n+(\s{1,})\n/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/^\n/, '');

  return res;
}

function createFileName(opts = {}, ext = '') {
  const { name = '' } = opts;
  const fileName = changeCase.paramCase(name);
  return `${fileName}${ext ? '.' + ext : ''}`;
}

function createDirName(opts = {}) {
  return createFileName(opts);
}

function createComponentName(opts = {}) {
  const { name = '' } = opts;
  return changeCase.pascalCase(name); // 'test string' => 'TestString'
}

function createClassName(opts = {}) {
  const { name = '', page = false } = opts;
  const className= changeCase.headerCase(name);
  return changeCase.paramCase(`${page ? 'page' : 'comp'}-${className}`); // 'test string' => 'test-string'
}

module.exports = {
  clearLine,
  createComponentName,
  createClassName,
  createFileName,
  createDirName
};
