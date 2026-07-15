---
title: "AI-Промпты для генерации ассетов Tower Defense"
date: "2026-05-03"
tags: [assets, nanobanana, ai-generation, tower-defense]
status: draft
---

# Промпты для nanobanana — Tower Defense

## Общие правила для всех спрайтов

- Aspect ratio: **1:1 (square)**
- Фон: **solid lime green background #00FF00** (я вырежу автоматически по цвету)
- Стиль: **pixel art / 2D game sprite**, чистые формы, читаемый силуэт
- Цветовая палитра:
  - Светлые силы (база, башни): золотисто-зелёные, белые, светло-коричневые
  - Тёмные силы (враги): тёмно-зелёные, чёрные, красные, фиолетовые
- Отсутствие текста, водяных знаков, логотипов
- Расположение объекта по центру кадра, занимает ~80% площади

---

## 1. База (светлые силы)

### BASE-01 — Эльфийская крепость

**Промпт:**
> Fantasy medieval elven castle base, elegant white stone towers with golden roofs, lush green vines, magical glowing blue crystals, top-down view, 2D game sprite, solid lime green background, centered, clean pixel art style, no text.

**Настройки:**
- Размер: 1:1 square
- Style: pixel art / fantasy 2D
- Negative: text, watermark, realistic, blurry edges, shadows on ground

---

## 2. Башни (светлые силы)

### TOWER-ARCHER — Башня лучников

> Medieval elven archer tower, white wood and stone structure, pointed golden roof, small balcony with bow symbol, top-down view, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### TOWER-MAGE — Башня магов

> Mystical elven mage tower, purple crystal spire, arcane runes glowing, floating magical orbs, dark wood and silver stone, top-down view, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### TOWER-CANNON — Артиллерийская башня

> Heavy dwarven cannon tower, thick stone walls, bronze cannon barrel pointing up, smokestacks, industrial fantasy style, top-down view, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### TOWER-BARRACKS — Казармы

> Elven barracks building, tents and training dummies, wooden palisade, banner with leaf symbol, top-down view, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

---

## 3. Враги (тёмные силы, side view facing right!)

### ENEMY-GOBLIN — Гоблин-пехотинец

> Small dark goblin warrior, green skin, rusty armor and shield, crude sword, side view facing right, aggressive stance, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

**Важно:** side view facing right — нос/голова смотрят вправо!

### ENEMY-ORC — Орк-танк

> Large muscular orc brute, dark green skin, heavy black iron armor, spiked mace, side view facing right, hunched aggressive posture, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### ENEMY-FLYER — Летучая мышь / Гаргулья

> Small bat-like gargoyle demon, dark purple wings spread, red glowing eyes, claws extended, top-down view (или side view facing right), 2D game sprite, solid lime green background, centered, clean pixel art, no text.

*Примечание: для летающих — top-down предпочтительнее, т.к. движение в любом направлении.*

### ENEMY-BOSS — Босс

> Massive demon lord, red skin, large curved horns, flaming sword, dark iron armor, wings folded, side view facing right, intimidating posture, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

---

## 4. Снаряды и эффекты

### PROJECTILE-ARROW

> Simple wooden arrow with steel tip and feather fletching, side view pointing right, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### PROJECTILE-FIREBALL

> Bright orange fireball with yellow core and flame trails, spherical, magical energy, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### PROJECTILE-CANNONBALL

> Round black iron cannonball with smoke trail, side view moving right, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### EFFECT-EXPLOSION (1 кадр)

> Bright explosion burst, orange and yellow flames, debris particles, circular impact, 2D game sprite, solid lime green background, centered, clean pixel art, no text.

---

## 5. UI и окружение

### TILE-GRASS

> Grass terrain tile, bright green meadow, small flowers, top-down view, 2D game tile, seamless texture feel, solid lime green background (заменю на прозрачный), clean pixel art, no text.

*Примечание: тайлы — особый случай, возможно потребуется ручная обрезка.*

### TILE-PATH

> Dirt road tile, brown earth, small stones, tire tracks, top-down view, 2D game tile, clean pixel art, no text.

### TILE-TREE

> Fantasy oak tree, green leafy canopy, brown trunk, top-down view (вид сверху на крону), 2D game sprite, solid lime green background, centered, clean pixel art, no text.

### UI-HEART

> Red heart icon, bright and glossy, small size, 2D game UI element, solid lime green background, clean pixel art, no text.

### UI-COIN

> Gold coin with leaf symbol, shiny metallic, 2D game UI element, solid lime green background, clean pixel art, no text.

### UI-WAVE

> Skull icon with arrow, representing enemy wave, dark fantasy style, 2D game UI element, solid lime green background, clean pixel art, no text.

---

## Размеры в игре (для справки при генерации)

| Тип | TILE_SIZE в игре | Рекомендуемый scale |
|-----|------------------|---------------------|
| База | 40px | ~2.0 (80px) |
| Башня | 40px | ~1.5 (60px) |
| Враг (гоблин) | 40px | ~0.8 (32px) |
| Враг (орк) | 40px | ~1.2 (48px) |
| Враг (босс) | 40px | ~2.0 (80px) |
| Снаряд | — | ~0.3 (12px) |
| UI иконки | — | 1.0 (native 256→ ~32px) |

*Генерируем всё в 256×256 — в игре масштабируем через scale.*
