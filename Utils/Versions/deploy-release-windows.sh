#!/bin/bash
set -e
path=$1
version=$2
prod=production-windows
echo "----> BUILDING WINDOWS APPX ON VERSION $version USING $prod WITH PATH $path <----";
cd $path/app;
rm -f -r $path/Utils/Versions/Windows/MtM_$version;
mkdir $path/Utils/Versions/Windows/MtM_$version;
ionic cordova build electron --release --configuration=$prod && \
mv $path/app/platforms/electron/build/* $path/Utils/Versions/Windows/MtM_$version;
echo "----> END WINDOWS APPX $prod <----";