#!/bin/bash

if [[ `git status --porcelain --untracked-files=no` ]]; then
    git add .
    git commit -m "Checksum ERC20 addresses [skip ci]"
    branch=$(git symbolic-ref --short -q HEAD)
    @echo $branch
    git push origin $branch
else
    @echo "Nothing to commit"
fi
