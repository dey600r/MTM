#!/bin/bash
path=$1
version=$2
echo "START BUILD MTM $version on $path"
cd $path/Utils/Versions/;
sh deploy-release-android.sh $path _ $version production $PASS_MTM $ALIAS_MTM &&
sh deploy-release-android-bundle.sh $path _ $version $PASS_MTM $ALIAS_MTM;
#sh deploy-release-windows.sh $path _ $version production;
echo "END BUILD MTM"