#!/bin/bash

export PATH=${PATH}:`go env GOPATH`/bin

# Function to build for a specific platform
build_for_platform() {
    local platform=$1
    local output_suffix=$2

    echo "Building for $platform"
    wails build -platform $platform -clean

    echo "Signing Package"
    gon -log-level=info ../build/darwin/gon-sign.json

    echo "Zipping Package"
    ditto -c -k --keepParent ./build/bin/flower.app ../../bin/flower_$output_suffix.zip

    echo "Cleaning up"
    rm -rf ./build/bin/flower.app
}

# Ensure we're in the desktop directory
cd "$(dirname "$0")/../desktop" || exit

# Create bin directory if it doesn't exist
mkdir -p ../bin

# Build for AMD64
build_for_platform "darwin/amd64" "darwin-amd64"

# Build for ARM64
build_for_platform "darwin/arm64" "darwin-arm64"

# Return to the original directory
cd ..

echo "Notarizing Zip Files"
gon -log-level=info ./desktop/build/darwin/gon-notarize.json
