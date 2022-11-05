#!/bin/bash
path=$1
version=$2
sh $path/Utils/Versions/deploy-release-android.bat $path _Free_ $version production-free $PASS_MTM $ALIAS_MTM &&
sh $path/Utils/Versions/deploy-release-android-bundle.bat $path _Free_ $version $PASS_MTM $ALIAS_MTM &&
sh $path/Utils/Versions/deploy-release-windows.bat $path _Free_ $path production-free;