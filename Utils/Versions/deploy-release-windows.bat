cd %1\App
rm -f -r %1\Utils\Versions\Windows\MtM%2%3
md %1\Utils\Versions\Windows\MtM%2%3
ionic cordova build windows --release --configuration=%4 --buildConfig=build-deploy.json -- --arch=x64 --appx=uap --platform=x64 && mv %1\App\platforms\windows\AppPackages\* %1\Utils\Versions\Windows\MtM%2%3
