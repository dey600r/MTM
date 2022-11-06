#!/bin/bash
path=$1
version=$2
echo "START BUILD MTM $version on $path"
cd $path/Utils/Versions/;
sh deploy-release-android.bat $path _Free_ $version production-free $PASS_MTM $ALIAS_MTM &&
sh deploy-release-android-bundle.bat $path _Free_ $version $PASS_MTM $ALIAS_MTM &&
sh deploy-release-windows.bat $path _Free_ $version production-free;
echo "END BUILD MTM"