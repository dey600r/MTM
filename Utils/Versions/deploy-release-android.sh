#!/bin/bash
path=$1
version=$2
prod=$3
pass=$4
alias=$5
free="_"
if [[ "$prod" == *"free"* ]]; then
  free="_Free_"
fi
echo "----> BUILDING ANDROID APK ON VERSION $version USING $prod <----";
cd $path/app;
rm -f -r $path/Utils/Versions/Android/MtM$free$version;
mkdir $path/Utils/Versions/Android/MtM$free$version;
ionic cordova build android --release --configuration=$prod-android && \
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "$pass" -keystore $path/Utils/Versions/Android/mtm-release-prod-key.keystore $path/app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $alias && \
zipalign -v -f 4 $path/app/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk $path/Utils/Versions/Android/MtM$free$version/MtM$free$version.apk;
echo "----> END ANDROID APK $prod <----";