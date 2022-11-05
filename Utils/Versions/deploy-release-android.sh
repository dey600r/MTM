#!/bin/bash
path=$1
free=$2
version=$3
prod=$4
pass=$5
alias=$6
echo "Building android apk on version $version using $prod";
cd $path/App;
rm -f -r $path/Utils/Versions/Android/MtM$free$version;
mkdir $path/Utils/Versions/Android/MtM$free$version;
ionic cordova build android --release --configuration=$prod && \
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "$pass" -keystore $path/Utils/Versions/Android/mtm-release-prod-key.keystore $path/App/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $alias && \
zipalign -v -f 4 $path/App/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $path/Utils/Versions/Android/MtM$free$version/MtM$free$version.apk;
