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
dirs.forEach(f => {
   fs.renameSync(f, f.toLowerCase());
   console.log('renamed to ', f.toLowerCase());
});