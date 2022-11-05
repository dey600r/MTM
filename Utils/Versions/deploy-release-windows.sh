#!/bin/bash
path=$1
free=$2
version=$3
prod=$4
echo "Building windows appx on version $version using $prod";
cd $path/App;
rm -f -r $path/Utils/Versions/Windows/MtM$free$version;
mkdir $path/Utils/Versions/Windows/MtM$free$version;
ionic cordova build windows --release --configuration=$prod --buildConfig=build-deploy.json -- --arch=x64 --appx=uap --platform=x64 && \
mv $path/App/platforms/windows/AppPackages/* $path/Utils/Versions/Windows/MtM$free$version;
