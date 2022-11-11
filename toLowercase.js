'use strict';

const path = require('path');
const fs = require('fs');
const dirs = [];

const scanDir = (dir, dirList = []) => {
    console.log('scanning', dir);
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        if (fs.statSync(path.join(dir, file)).isDirectory()) {
            scanDir(path.join(dir, file), dirList);
            dirs.push(path.join(dir, file));
        }
    });
};

scanDir( './blockchains');

console.log(dirs);
dirs.forEach(currentDir => {
    const newDir = currentDir.toLowerCase()
    if (fs.existsSync(newDir)) {
        return;
    }
   fs.cpSync(currentDir, newDir, { recursive: true });
   console.log(`copied ${currentDir} to ${newDir}`);
});
