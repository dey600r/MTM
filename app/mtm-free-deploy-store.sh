#!/bin/bash
path=$1
version=$2
echo "----> START BUILD MTM-FREE $version on $path <----"
cd $path/Utils/Versions/;
sh deploy-release-android.sh $path _Free_ $version production-free $PASS_MTM $ALIAS_MTM &&
sh deploy-release-android-bundle.sh $path _Free_ $version $PASS_MTM $ALIAS_MTM &&
sh deploy-release-windows.sh $path _Free_ $version production-free;
echo "----> END BUILD MTM-FREE <----"