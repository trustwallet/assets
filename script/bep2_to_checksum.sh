#!/bin/bash

cd ../
cd "blockchains/binance/assets"

for symbol in *
do
    echo $symbol
    upper=$(echo "$symbol" | awk '{print toupper($0)}')
    git mv "$symbol" "$upper-test" && git mv "$upper-test" "$upper" 
done