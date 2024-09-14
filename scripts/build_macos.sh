#!/bin/bash

export PATH=${PATH}:`go env GOPATH`/bin
echo "building on AMD64"
cd desktop
wails build -platform darwin/amd64 -clean
cd ..
echo "Signing Package"
gon -log-level=info ./desktop/build/darwin/gon-sign.json
echo "Zipping Package"
ditto -c -k --keepParent ./desktop/build/bin/flower.app ./bin/flower_darwin-amd64.zip
echo "Cleaning up"
rm -rf ./desktop/build/bin/RiftShare.app

echo "building on ARM64"
cd desktop
wails build -platform darwin/arm64 -clean
cd ..
echo "Signing Package"
gon -log-level=info -log-json ./desktop/build/darwin/gon-sign.json
echo "Zipping Package"
ditto -c -k --keepParent ./desktop/build/bin/flower.app ./bin/flower_darwin-arm64.zip
echo "Cleaning up"
rm -rf ./desktop/build/bin/RiftShare.app

echo "Notarizing Zip Files"
gon -log-level=info ./desktop/build/darwin/gon-notarize.json
