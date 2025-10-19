#!/bin/bash
path=$1
version=$2
echo "----> START BUILD MTM $version on $path <----"
cd $path/Utils/Versions/;
sh deploy-release-android.sh $path $version;
#sh deploy-release-windows.sh $path $version;
echo "----> END BUILD MTM <----"