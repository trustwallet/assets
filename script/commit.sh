#!/bin/bash

if [[ `git status --porcelain --untracked-files=no` ]]; then
    git add .
    git commit -m "Checksum ERC20 addresses [skip ci]"
    branch=$(git symbolic-ref --short -q HEAD)
    echo Current branch $BUILD_SOURCEBRANCH
    echo echoPushing changes to branch: $branch
    git push origin HEAD:$branch
else
    echo "Nothing to commit"
fi