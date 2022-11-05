#!/bin/bash
path=$1
free=$2
version=$3
pass=$4
alias=$5
cd $path/App/platforms/android;
./gradlew bundle &&
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "$pass" -keystore $path/Utils/Versions/Android/mtm-release-prod-key.keystore $path/App/platforms/android/app/build/outputs/bundle/release/app-release.aab $alias &&
mv $path/App/platforms/android/app/build/outputs/bundle/release/app-release.aab $path/Utils/Versions/Android/MtM$free$version/MtM$free$version.aab;
cd $path/App/;