#!/bin/bash

chainsToChecksum="classic poa tomochain gochain wanchain thundertoken ethereum"

cd ..
cd "blockchains"

for chain in $chainsToChecksum; do
    cd "$chain/assets"
    echo "Processing folder $PWD"

    for addr in *
    do 
    isChecksum=$(ethereum_checksum_address $addr --check)
    if ! $isChecksum
    then
        echo -e "\033[31;1m$addr\033[0m"
        checksum=$(ethereum_checksum_address $addr)
        echo $checksum
        git mv -n "$addr" "$addr-temp"
        git mv -n "$addr-temp" "$checksum"
    else
        echo -e "\033[32;1m$addr\033[0m"
    fi
    done

    echo
    cd ../..
done

