#!/bin/bash
path=$1
free=$2
version=$3
pass=$4
alias=$5
echo "---> BUILDING ANDROID BUNDLE ON VERSION $version USING $prod <----";
cd $path/app/platforms/android;
./gradlew bundle &&
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "$pass" -keystore $path/Utils/Versions/Android/mtm-release-prod-key.keystore $path/app/platforms/android/app/build/outputs/bundle/release/app-release.aab $alias &&
mv $path/app/platforms/android/app/build/outputs/bundle/release/app-release.aab $path/Utils/Versions/Android/MtM$free$version/MtM$free$version.aab;
cd $path/app/;
echo "----> END ANDROID BUNDLE $prod <----";