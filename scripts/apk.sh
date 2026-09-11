#!/usr/bin/env bash
# Compila el APK de release y lo deja fechado en build/.
set -euo pipefail

cd "$(dirname "$0")/.."

# Solo ARM: x86 y x86_64 las usa un emulador y son casi la mitad del peso del APK.
android/gradlew -p android assembleRelease -PreactNativeArchitectures=arm64-v8a,armeabi-v7a

version=$(node -p "require('./app.json').expo.version")
destino="build/chasqui-$version-$(date +%Y%m%d-%H%M).apk"

mkdir -p build
cp android/app/build/outputs/apk/release/app-release.apk "$destino"

echo
ls -lh "$destino"
