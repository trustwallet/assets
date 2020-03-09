#!/bin/bash

if [[ `git status --porcelain --untracked-files=no` ]]; then
    git add .
    git commit -m "Checksum ERC20 addresses [skip ci]"
    echo Pushing changes to branch: "$SYSTEM_PULLREQUEST_SOURCEBRANCH"
    echo Current branch $(git branch)
    git status
    git push origin HEAD:"$SYSTEM_PULLREQUEST_SOURCEBRANCH"
    echo Complete
else
    echo "Nothing to commit"
fi