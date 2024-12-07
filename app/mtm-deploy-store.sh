#!/bin/bash
path=$1
version=$2
echo "----> START BUILD MTM $version on $path <----"
cd $path/Utils/Versions/;
sh deploy-release-android.sh $path $version production $PASS_MTM $ALIAS_MTM;
echo "----> END BUILD MTM <----"