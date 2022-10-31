cd %1\App
rm -f -r %1\Utils\Versions\Android\MtM%2%3
md %1\Utils\Versions\Android\MtM%2%3
ionic cordova build android --release --configuration=%4 && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "%5" -keystore %1\Utils\Versions\Android\mtm-release-prod-key.keystore %1\App\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk %6 && zipalign -v -f 4 C:\Proyectos\MTM\App\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk %1\Utils\Versions\Android\MtM%2%3\MtM%2%3.apk
