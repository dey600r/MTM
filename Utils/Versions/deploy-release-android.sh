#!/bin/bash
set -e
path=$1
version=$2
prod=production-android
pass=$PASS_MTM
alias=$ALIAS_MTM
echo "----> BUILDING ANDROID ON VERSION $version USING $prod WITH PATH $path <----";
path_version=$path/Utils/Versions/Android/MtM_$version
path_key=$path/Utils/Versions/Android
path_build=$path/app/platforms/android/app/build
path_output=$path_build/outputs
path_release=$path_output/bundle/release
path_native_lib=$path_build/intermediates/merged_native_libs/release/mergeReleaseNativeLibs/out/lib
path_retrace_r8=$path_output/mapping/release
path_trace_store=$path_version/trace-store
cd $path/app;
rm -f -r $path_version;
mkdir $path_version;
ionic cordova build android --release --configuration=$prod && \
echo "--- SIGNING BUNDLE ANDROID $alias/$pass---"
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "$pass" -keystore $path_key/mtm-release-prod-key.keystore $path_release/app-release.aab $alias && \
echo "--- ZIPPING BUNDLE ANDROID ---"
zipalign -v -f 4 $path_release/app-release.aab $path_version/MtM_$version.aab;
echo "--- CREATING OUTPUT NATIVE LIBS ANDROID ---"
mkdir $path_trace_store
echo "--- SAVING BUNDLE RETRACE R8 ---"
cp $path_retrace_r8/* $path_trace_store
rm -rf $path_output
echo "--- SAVING BUNDLE NATIVE LIBS ---"
{ # TRY
  cd $path_native_lib &&
  zip -rv native-libs-symbols-all.zip * &&
  mv native-libs-symbols-all.zip $path_trace_store &&
  rm -rf $path_native_lib/armeabi &&
  zip -rv native-libs-symbols.zip * &&
  mv native-libs-symbols.zip $path_trace_store
} || { # CATCH
  echo "ERROR: NO NATIVE LIBS FOUND"
}
echo "----> END ANDROID $prod <----";