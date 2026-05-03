import {
  LEVEL_1_WAYPOINTS,
  LEVEL_1_WAVES,
  LEVEL_2_WAYPOINTS,
  LEVEL_2_WAVES,
  LEVEL_3_WAYPOINTS,
  LEVEL_3_WAVES,
  generateBuildableMap,
} from './levelData';

export const LEVELS = [
  {
    id: 1,
    name: 'Forest Path',
    description: 'Classic zigzag. Good for beginners.',
    difficulty: 'Easy',
    waypoints: LEVEL_1_WAYPOINTS,
    waves: LEVEL_1_WAVES,
    startGold: 300,
    baseMaxHealth: 100,
    color: '#4caf50',
  },
  {
    id: 2,
    name: 'River Crossing',
    description: 'Wide horizontal zigzag. More waves, tighter lanes.',
    difficulty: 'Medium',
    waypoints: LEVEL_2_WAYPOINTS,
    waves: LEVEL_2_WAVES,
    startGold: 250,
    baseMaxHealth: 80,
    color: '#2196f3',
  },
  {
    id: 3,
    name: 'Snake Pit',
    description: 'Tight spiral path. Bosses come early. Survive if you can.',
    difficulty: 'Hard',
    waypoints: LEVEL_3_WAYPOINTS,
    waves: LEVEL_3_WAVES,
    startGold: 200,
    baseMaxHealth: 60,
    color: '#f44336',
  },
];

export { generateBuildableMap };
