# Локальная сборка iOS (Mac)

## Требования

- macOS 13+ (Ventura или новее)
- Xcode 15+ (App Store → загрузить)
- Node.js 22+ (`brew install node@22` или через [nvm](https://github.com/nvm-sh/nvm))
- CocoaPods (`sudo gem install cocoapods`)
- Git

## Подготовка проекта

```bash
cd tower-defense-rn
npm install
```

## Генерация нативного проекта iOS

```bash
npx expo prebuild --platform ios --clean
```

> Флаг `--clean` удаляет старую папку `ios/` и пересоздаёт её. Используй без флага, если вручную правил нативный код.

## Установка Pod-зависимостей

```bash
cd ios && pod install && cd ..
```

Если `pod install` падает с ошибкой Flipper — добавь в `ios/Podfile` перед `use_react_native`:

```ruby
:flipper_configuration => FlipperConfiguration.disabled
```

и перезапусти `pod install`.

## Запуск в симуляторе

```bash
npx expo run:ios
```

Или через Xcode:

```bash
open ios/towerdefense.xcworkspace
```

В Xcode: выбери схему `towerdefense` → целевой симулятор → нажми **▶ Build & Run** (`Cmd+R`).

## Запуск на физическом iPhone

### Без Apple Developer аккаунта (бесплатно, до 7 дней)

1. Подключи iPhone к Mac кабелем.
2. В Xcode: `Window → Devices and Simulators` → убедись, что девайс виден.
3. В настройках проекта (`Signing & Capabilities`):
   - Team: выбери свой Apple ID (Personal Team).
   - Bundle Identifier: измени на уникальный (например, `com.emaxe.towerdefense.local`).
4. Нажми **▶** — Xcode подпишет и установит приложение.
5. На iPhone: `Настройки → Основные → VPN и управление устройством` → доверь своему Apple ID.

Приложение будет работать 7 дней, потом требует пересборки.

### С Apple Developer аккаунт ($99/год)

- Та же процедура, но Team выбираешь платную.
- Можно распространять через TestFlight или App Store Connect.
- Подпись держится 1 год.

## Создание архива (IPA)

В Xcode:

1. Выбери таргет `Any iOS Device (arm64)`.
2. `Product → Archive`.
3. В `Organizer` (`Window → Organizer`) выбери архив → `Distribute App`.

Для ad-hoc: выбери `Ad Hoc` → экспортируй `.ipa`, который установишь через Finder или [Apple Configurator](https://apps.apple.com/app/apple-configurator-2/id1037126344).

## Troubleshooting

| Ошибка | Решение |
|--------|---------|
| `Could not find node` | `which node` → пропиши путь в `ios/.xcode.env.local` |
| `CocoaPods could not find compatible versions` | `cd ios && pod update && cd ..` |
| `Signing for "towerdefense" requires a development team` | Xcode → Targets → Signing & Capabilities → выбери Team |
| Metro bundler не стартует | Запусти в отдельном терминале: `npx expo start --ios` |
| `flipper` ошибки при pod install | Отключи Flipper в `Podfile` (см. выше) |

## Ссылки

- [Expo Local Builds](https://docs.expo.dev/guides/local-app-development/)
- [Apple Developer Portal](https://developer.apple.com/)
