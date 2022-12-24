const path = require('path');
const fs = require('fs-extra');

const packagePath = path.resolve('demo', 'node_modules', '@briandlee', 'remix-return-navigation');

if (!fs.existsSync(packagePath)) {
  fs.mkdirSync(packagePath);
}

fs.copySync(path.resolve('dist'), path.resolve(packagePath, 'dist'), { overwrite: true });
fs.copySync(path.resolve('package.json'), path.resolve(packagePath, 'package.json'), {
  overwrite: true,
});
