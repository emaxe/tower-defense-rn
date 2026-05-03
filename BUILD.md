# Сборка APK

Сборка Android APK выполняется автоматически через **GitHub Actions** — без Expo аккаунта и без EAS Build.

## Автоматический запуск

При любом `git push` в ветку `master` workflow `.github/workflows/build-apk.yml` запускается сам.

## Ручной запуск

1. Открыть https://github.com/emaxe/tower-defense-rn/actions/workflows/build-apk.yml
2. Нажать **Run workflow** → выбрать ветку `master` → **Run workflow**

## Получение APK

1. Открыть последний запуск Actions → секция **Artifacts**
2. Скачать `app-release-apk` (ZIP, ~28 MB)
3. Распаковать — внутри `app-release.apk` (~60 MB)

## Архитектура сборки

- Ubuntu runner на GitHub Actions
- `expo prebuild --platform android --clean` → генерация Android-проекта
- `./gradlew assembleRelease` → сборка release APK
- JDK 17 Temurin + Android SDK

## Не требуется

- Expo аккаунт / EAS Token
- Apple Developer
- Локальный Android SDK
