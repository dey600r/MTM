#!/bin/bash
path=$1
version=$2
sh $1/Utils/Versions/deploy-release-android.sh $path _ $version production $PASS_MTM $ALIAS_MTM &&
sh $1/Utils/Versions/deploy-release-android-bundle.sh $1 _ $2 $PASS_MTM $ALIAS_MTM;
#sh $1/Utils/Versions/deploy-release-windows.sh $1 _ $2 production;