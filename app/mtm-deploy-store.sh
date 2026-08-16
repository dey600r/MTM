#!/bin/bash
path=$1
version=$2
winbuild=${3:-1}
echo "----> START BUILD MTM $version on $path <----"
cd $path/Utils/Versions/;
sh deploy-release-android.sh $path $version;
if [ "$winbuild" != "0" ]; then
	sh deploy-release-windows.sh $path $version;
fi
echo "----> END BUILD MTM <----"