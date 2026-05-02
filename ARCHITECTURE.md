---
title: "Tower Defense RN — Архитектура"
date: 2026-05-02
tags: [architecture, gamedev, react-native]
status: draft
---

# Tower Defense RN — Архитектура

## Общая концепция

Мобильная игра жанра **Tower Defense** на React Native. Игровое поле — сетка тайлов с заданным маршрутом (waypoints), по которому движутся волны врагов. Игрок строит башни вдоль пути, чтобы уничтожать врагов до того, как они достигнут базы.

### Жанровые механики
- **Сеточное поле**: 12×8 тайлов (ландшафт ориентация)
- **Фиксированный путь**: враги идут строго по заданным waypoints
- **Башни 3 типов**: Базовая (одиночный урон), Ледяная (замедление), Бомбардир (AoE)
- **Волны**: 10+ волн с нарастающей сложностью
- **Экономика**: золото за убийство, траты на постройку/апгрейд
- **Жизни базы**: 20 HP, враг дошел — -1 HP

---

## Технический стек

| Слой | Технология | Обоснование |
|------|-----------|-------------|
| Фреймворк | Expo SDK 54 + React Native | Кроссплатформа, hot reload, EAS builds |
| Рендер | `react-native-svg` | Векторная графика, Canvas-подобный API, плавная анимация |
| Игровой цикл | `requestAnimationFrame` | 60 FPS, точный тайминг |
| Состояние | Класс `GameEngine` (вне React) + `useRef` | Избегаем ререндеров каждый кадр |
| Навигация | `@react-navigation/native` | Экраны: Меню, Игра, Пауза, Результат |
| Ассеты | Emoji + SVG shapes | Нет зависимостей от тяжелых спрайтов, малый вес APK |

---

## Архитектура: ECS-подобный подход

Игра построена по упрощенному ECS (Entity-Component-System) паттерну. React отвечает только за рендер UI и ввод, вся игровая логика работает в чистом JavaScript.

```
┌─────────────────────────────────────┐
│           React Layer                 │
│  ┌─────────┐  ┌─────────┐  ┌────────┐ │
│  │  Menu   │  │  Game   │  │  HUD   │ │
│  │ Screen  │  │ Screen  │  │ Panel  │ │
│  └────┬────┘  └────┬────┘  └────────┘ │
│       │            │                    │
│       └────────────┼────────────────────┘
│                    │ refs to engine
├────────────────────┼─────────────────────┤
│         GameEngine (Singleton)           │
│  ┌─────────────────────────────────────┐│
│  │  state: { enemies, towers,          ││
│  │         projectiles, map,            ││
│  │         gold, lives, wave }          ││
│  └─────────────────────────────────────┘│
│                    │
│         ┌──────────┼──────────┐
│         ▼          ▼          ▼
│  ┌──────────┐ ┌─────────┐ ┌──────────┐
│  │ Movement │ │ Combat  │ │   Wave   │
│  │  System  │ │ System  │ │  System  │
│  └──────────┘ └─────────┘ └──────────┘
│         │          │          │
│         └──────────┼──────────┘
│                    ▼
│         ┌──────────────────┐
│         │   Render System  │  → SVG обновление (setNativeProps)
│         └──────────────────┘
└─────────────────────────────────────┘
```

### Почему state вне React?

При 60 FPS обновление React state (`useState`) каждый кадр вызывает ререндер всего дерева — это катастрофа для производительности. Вместо этого:
- `GameEngine` хранит mutable state в обычных объектах/массивах
- Каждый кадр системы мутируют state напрямую
- React получает только «отсечки» — при спавне волны, постройке башни, Game Over
- Для плавной графики используем `react-native-svg` с `setNativeProps` или передаем координаты в SVG элементы каждый кадр через ref

---

## Структура проекта

```
tower-defense-rn/
├── App.js                          # Root, NavigationContainer
├── index.js                        # registerRootComponent
├── ARCHITECTURE.md                 # Этот документ
├── src/
│   ├── constants/
│   │   └── gameConfig.js           # Константы: размеры, цены, скорости
│   ├── engine/
│   │   ├── GameEngine.js           # Главный singleton: state + tick()
│   │   └── GameLoop.js             # RAF loop, delta-time
│   ├── entities/
│   │   ├── Enemy.js                # Класс врага (HP, speed, path progress)
│   │   ├── Tower.js                # Класс башни (range, damage, cooldown)
│   │   ├── Projectile.js           # Класс снаряда (target tracking)
│   │   └── Map.js                  # Tile map + waypoints
│   ├── systems/
│   │   ├── MovementSystem.js       # Движение врагов по waypoints
│   │   ├── CombatSystem.js         # Башни ищут цели, стреляют
│   │   ├── WaveSystem.js           # Спавн волн по таймеру
│   │   └── CollisionSystem.js      # Попадания снарядов
│   ├── components/
│   │   ├── GameBoard.js            # SVG canvas + все игровые объекты
│   │   ├── HUD.js                  # Золото, жизни, волна, меню башен
│   │   ├── TowerMenu.js            # Панель выбора типа башни
│   │   ├── EnemyRenderer.js        # SVG группа врагов
│   │   ├── TowerRenderer.js        # SVG группа башен
│   │   └── ProjectileRenderer.js   # SVG группа снарядов
│   ├── screens/
│   │   ├── MenuScreen.js           # Главное меню
│   │   ├── GameScreen.js           # Игровой экран (Board + HUD)
│   │   ├── PauseScreen.js          # Пауза (overlay)
│   │   └── GameOverScreen.js       # Результат уровня
│   ├── levels/
│   │   └── level1.js               # Waypoints, доступные тайлы для башен
│   └── utils/
│       ├── math.js                 # Дистанция, интерполяция
│       └── id.js                   # UUID генератор
├── assets/
│   ├── sprites/                    # SVG тайлы (если нужны)
│   └── sounds/                     # SFX (опционально)
└── .github/
    └── workflows/
        └── build-apk.yml           # CI/CD
```

---

## Игровые сущности

### Enemy (Враг)

```javascript
{
  id: string,
  type: 'goblin' | 'orc' | 'boss',
  x: number,           // текущая позиция (SVG coords)
  y: number,
  hp: number,
  maxHp: number,
  speed: number,       // тайлов/сек
  pathProgress: number,// индекс waypoint + прогресс 0..1
  active: boolean,     // false если дошел или убит
  effects: {           // активные эффекты
    slow: { factor, remainingMs }
  }
}
```

Движение: интерполяция между waypoints[i] и waypoints[i+1] по `speed * deltaTime`.

### Tower (Башня)

```javascript
{
  id: string,
  type: 'basic' | 'ice' | 'bomb',
  tileX: number,       // позиция на сетке
  tileY: number,
  x: number,           // центр в SVG coords
  y: number,
  level: 1..3,
  range: number,       // радиус в тайлах
  damage: number,
  cooldown: number,    // сек между выстрелами
  cooldownRemaining: number,
  targetId: string | null,
  angle: number        // поворот к цели
}
```

### Projectile (Снаряд)

```javascript
{
  id: string,
  type: 'bullet' | 'ice' | 'bomb',
  x: number,
  y: number,
  targetId: string,    // homing missile
  speed: number,
  damage: number,
  splashRadius: number,// для bomb
  active: boolean
}
```

### Map

```javascript
{
  width: 12,           // tiles
  height: 8,
  tileSize: number,   // px (вычисляется от Dimensions)
  waypoints: [{x, y}], // маршрут в координатах тайлов
  buildable: boolean[][],// true где можно строить
}
```

---

## Игровые системы

### 1. GameLoop

```javascript
function gameLoop(timestamp) {
  const dt = (timestamp - lastTimestamp) / 1000; // delta в секундах
  lastTimestamp = timestamp;

  engine.tick(dt);
  // React НЕ обновляется здесь — SVG обновляется через refs
  requestAnimationFrame(gameLoop);
}
```

**Дelta-time (dt)** позволяет игре работать с одинаковой скоростью на любом FPS.

### 2. MovementSystem

Для каждого активного врага:
1. Получить текущий waypoint (`floor(pathProgress)`)
2. Вычислить вектор к следующему waypoint
3. Сдвинуть: `position += direction * speed * dt * (1 - slowFactor)`
4. Если достиг waypoint — инкремент `pathProgress`
5. Если последний waypoint — пометить `active = false`, `lives--`

### 3. CombatSystem

Для каждой башни с `cooldownRemaining <= 0`:
1. Найти ближайшего активного врага в радиусе `range`
2. Если нашел — создать Projectile, сбросить cooldown
3. `cooldownRemaining -= dt` для всех башен

Для каждого снаряда:
1. Получить координаты цели (`targetId`)
2. Двигаться к цели со `speed`
3. Если расстояние < hitRadius — применить урон, пометить `active = false`
4. Если цель мертва — пометить `active = false`

### 4. WaveSystem

```javascript
{
  currentWave: number,
  waveActive: boolean,
  enemiesRemaining: number,
  spawnInterval: number,  // сек между спавнами
  spawnTimer: number
}
```

- Когда волна начинается: `enemiesRemaining = waveConfig.count`
- Каждые `spawnInterval` сек: `spawnEnemy(waveConfig.type)`
- Когда `enemiesRemaining === 0` и нет активных врагов: волна завершена, бонус золота, предложить следующую

### 5. CollisionSystem

- Снаряд-до-врага: distance < hitThreshold → урон
- AoE (bomb): нанести урон всем врагам в `splashRadius`
- Ice: урон + применить `effects.slow` на 2 сек

---

## Рендер: SVG Canvas

`GameBoard` — единственный React компонент, который обновляется каждый кадр. Структура:

```jsx
<Svg width={screenW} height={screenH}>
  {/* Фон / тайлы */}
  <MapRenderer map={engine.map} />

  {/* Путь */}
  <Path d={waypointsToSvgPath(map.waypoints)} stroke="..." />

  {/* Башни */}
  {engine.towers.map(t => <TowerShape key={t.id} tower={t} />)}

  {/* Враги */}
  {engine.enemies.map(e => e.active && <EnemyShape key={e.id} enemy={e} />)}

  {/* Снаряды */}
  {engine.projectiles.map(p => p.active && <ProjectileShape key={p.id} proj={p} />)}

  {/* Range indicator при выборе тайла */}
  {selectedTile && <Circle cx={...} cy={...} r={...} opacity={0.3} />}
</Svg>
```

**Оптимизация**: вместо обновления React props каждый кадр, используем `setNativeProps` на ref SVG элементов для плавного движения. Однако с `react-native-svg` и `< 50` объектов простой ререндер через props работает на 60 FPS.

---

## UI / Экраны

### MenuScreen
- Логотип
- Кнопка «Играть» (переход к GameScreen)
- Кнопка «Уровни» (список, пока 1)
- Настройки (звук, сложность)

### GameScreen
- GameBoard на весь экран (кроме HUD)
- HUD overlay (SafeAreaView)
- Touch handlers: tap на тайл → TowerMenu

### HUD
- Золото: 💰 150
- Жизни: ❤️ 18/20
- Волна: 🌊 3/10
- Кнопки: ⏸️ Пауза, ⏩ Ускорить ×2

### TowerMenu (Bottom Sheet / Panel)
При тапе на buildable тайл:
- Показать 3 типа башни с ценами
- Если башня уже есть — показать «Апгрейд» или «Продать»
- Подсветить радиус выбранной башни

### GameOverScreen
- Победа / Поражение
- Статистика: убито, золото заработано, время
- Кнопки: «Еще раз», «Меню»

---

## Баланс (начальный)

| Башня | Стоимость | Урон | Дальность | Скорострельность | Эффект |
|-------|-----------|------|-----------|------------------|--------|
| Basic | 50 | 10 | 3 тайла | 1.0/сек | — |
| Ice   | 100 | 5 | 3 тайла | 0.8/сек | Замедление 50% на 2с |
| Bomb  | 150 | 15 | 2 тайла | 0.5/сек | AoE радиус 1.5 тайла |

| Враг | HP | Скорость | Золото |
|------|----|----------|--------|
| Goblin | 30 | 2 тайла/с | 10 |
| Orc    | 80 | 1.2 тайла/с | 20 |
| Boss   | 300 | 0.8 тайла/с | 100 |

| Волна | Кол-во | Типы | Интервал |
|-------|--------|------|----------|
| 1 | 5 | Goblin | 1.5с |
| 2 | 8 | Goblin | 1.2с |
| 3 | 5 | Goblin + 2 Orc | 1.5с |
| 5 | 10 | Orc | 2.0с |
| 10 | 1 Boss + 5 Orc | 3.0с |

---

## CI/CD

- **GitHub Actions** `.github/workflows/build-apk.yml`
- **Метод**: `expo prebuild` → `./gradlew assembleRelease` (бесплатно, без EAS аккаунта)
- **Триггер**: push в `main` или `workflow_dispatch`
- **APK артефакт**: 55–65 MB (Telegram >50MB, шарим через GitHub artifact link)

---

## Дорожная карта (MVP → v1.0)

### MVP ( playable prototype )
- [x] Структура проекта
- [ ] GameEngine + GameLoop
- [ ] 1 уровень с waypoints
- [ ] 1 тип башни (Basic)
- [ ] 1 тип врага (Goblin)
- [ ] 3 волны
- [ ] HUD (золото, жизни, пауза)
- [ ] APK build

### v0.2
- [ ] 3 типа башен
- [ ] Ice + Bomb эффекты
- [ ] 10 волн, Orc + Boss
- [ ] Апгрейд башен (1→2→3 уровень)
- [ ] Звуковые эффекты

### v1.0
- [ ] 3 уровня с разными картами
- [ ] Система звезд (1–3 за уровень)
- [ ] Лидерборд / локальные рекорды
- [ ] Полировка UI, анимации

---

## Производительность: целевые метрики

- **FPS**: стабильные 60 на mid-range Android
- **Объектов**: до 50 врагов + 20 башен + 30 снарядов = ~100 SVG элементов
- **Рендер**: React ререндер только при событиях (постройка, Game Over), SVG через refs
- **Память**: <100 MB RAM

