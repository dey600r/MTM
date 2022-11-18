#!/bin/bash
path=$1
version=$2
prod=$3
free="_"
if [[ "$prod" == *"free"* ]]; then
  free="_Free_"
fi
echo "----> BUILDING WINDOWS APPX ON VERSION $version USING $prod <----";
cd $path/app;
rm -f -r $path/Utils/Versions/Windows/MtM$free$version;
mkdir $path/Utils/Versions/Windows/MtM$free$version;
ionic cordova build windows --release --configuration=$prod-windows --buildConfig=build-deploy.json -- --arch=x64 --appx=uap --platform=x64 && \
mv $path/app/platforms/windows/AppPackages/* $path/Utils/Versions/Windows/MtM$free$version;
echo "----> END WINDOWS APPX $prod <----";