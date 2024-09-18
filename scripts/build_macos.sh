#!/bin/bash
export PATH=${PATH}:`go env GOPATH`/bin

build_for_platform() {
    local platform=$1
    local output_suffix=$2

    echo "Building for $platform"
    wails build -platform $platform -clean

    echo "Signing Package"
    gon -log-level=info ./build/darwin/gon-sign.json

    echo "Zipping Package"
    appdmg ./build/appdmg.json ../bin/flower_$output_suffix.dmg
}

cd "$(dirname "$0")/../desktop" || exit

mkdir -p ../bin

build_for_platform "darwin/amd64" "amd64"
build_for_platform "darwin/arm64" "arm64"

#echo "Notarizing Dmg?"
#gon -log-level=info ./build/darwin/gon-notarize.json
