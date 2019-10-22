#!/bin/bash

for i in *
do 
    name=$(echo "$i" | awk '{print toupper($0)}')
    git mv "$i" "$name-test" && git mv "$name-test" "$name" 
done