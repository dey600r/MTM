cd %1\App\platforms\android
gradlew bundle && jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -storepass "%4" -keystore %1\Utils\Versions\Android\mtm-release-prod-key.keystore %1\App\platforms\android\app\build\outputs\bundle\release\app-release.aab %5 && mv %1\App\platforms\android\app\build\outputs\bundle\release\app-release.aab %1\Utils\Versions\Android\MtM%2%3\MtM%2%3.aab && cd %1\App\