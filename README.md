# 🏰 Tower Defense RN

Мобильная игра жанра **Tower Defense** на React Native + SVG.

## Архитектура

Игра построена по упрощенному ECS-подходу:
- **GameEngine** — чистый JS singleton, хранит всё состояние
- **GameLoop** — `requestAnimationFrame` с delta-time
- **React** — только UI: Menu, HUD, TowerMenu, GameOver
- **SVG** — рендер игрового поля (60 FPS без React ререндеров)

## Стек

- Expo SDK 54
- React Native 0.81
- react-native-svg (векторная графика)
- Без внешних игровых движков — легковесный чистый JS

## Запуск

```bash
npm install
npx expo start
```

## Структура

```
src/
  engine/       — GameEngine + GameLoop
  entities/     — Enemy, Tower, Projectile
  systems/      — Movement, Combat, Wave, Collision
  components/   — GameBoard (SVG), HUD, TowerMenu
  screens/      — Menu, Game, GameOver
  levels/       — Waypoints, buildable map
  constants/    — Баланс, цвета, конфигурации
```

## Механики

- **12×8 сетка** с фиксированным путём waypoints
- **3 типа башен**: Basic, Ice (замедление), Bomb (AoE)
- **10 волн**: Goblin → Orc → Boss
- **Экономика**: золото за убийство, постройка/апгрейд/продажа
- **Апгрейд башен** до 3 уровня

## Сборка APK

GitHub Actions (бесплатно, без EAS):
```bash
# Push в main запускает workflow
# Артефакт: .github/workflows/build-apk.yml
```

## Документация

См. [ARCHITECTURE.md](./ARCHITECTURE.md) — полное описание архитектуры, ECS, баланса, дорожную карту.
