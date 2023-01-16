#!/bin/bash
path=$1
version=$2
pass=$3
alias=$4
free=$5
echo "----> GETTING APK ANDROID FROM BUNDLE $version USING $path <----";
path_version=$path/Utils/Versions/Android/MtM$free$version
path_key=$path/Utils/Versions/Android
java -jar "C:\Program Files\Java\bundletool-all-1.13.2.jar" build-apks --bundle=$path_version/MtM$free$version.aab --output=$path_version/MtM_unsigned.apks
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "$pass" -keystore $path_key/mtm-release-prod-key.keystore $path_version/MtM_unsigned.apks $alias && \
zipalign -v -f 4 $path_version/MtM_unsigned.apks $path_version/MtM$free$version.apks && \
rm $path_version/MtM_unsigned.apks;
echo "----> END ANDROID <----";