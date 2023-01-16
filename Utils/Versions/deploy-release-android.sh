#!/bin/bash
path=$1
version=$2
prod=$3-android
pass=$4
alias=$5
free="_"
case $prod in
  *free*)
    free="_Free_";
esac
echo "----> BUILDING ANDROID ON VERSION $version USING $prod WITH PATH $path AND $free <----";
path_version=$path/Utils/Versions/Android/MtM$free$version
path_key=$path/Utils/Versions/Android
path_release=$path/app/platforms/android/app/build/outputs/bundle/release
cd $path/app;
rm -f -r $path_version;
mkdir $path_version;
ionic cordova build android --release --configuration=$prod && \
echo "--- SIGNING BUNDLE ANDROID ---"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "$pass" -keystore $path_key/mtm-release-prod-key.keystore $path_release/app-release.aab $alias && \
echo "--- ZIPPING BUNDLE ANDROID ---"
zipalign -v -f 4 $path_release/app-release.aab $path_version/MtM$free$version.aab;
echo "----> END ANDROID $prod <----";