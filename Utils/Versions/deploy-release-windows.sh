#!/bin/bash
set -e
path=$1
version=$2
prod=$3-windows
free="_"
case $prod in
  *free*)
    free="_Free_";
esac
echo "----> BUILDING WINDOWS APPX ON VERSION $version USING $prod WITH PATH $path AND $free <----";
cd $path/app;
rm -f -r $path/Utils/Versions/Windows/MtM$free$version;
mkdir $path/Utils/Versions/Windows/MtM$free$version;
ionic cordova build windows --release --configuration=$prod --buildConfig=build-deploy.json -- --arch=x64 --appx=uap --platform=x64 && \
mv $path/app/platforms/windows/AppPackages/* $path/Utils/Versions/Windows/MtM$free$version;
echo "----> END WINDOWS APPX $prod <----";