const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const moneyEl = document.getElementById("money");
const livesEl = document.getElementById("lives");
const waveEl = document.getElementById("wave");
const waveNameEl = document.getElementById("waveName");
const waveCountEl = document.getElementById("waveCount");
const nextSpawnEl = document.getElementById("nextSpawn");
const startWaveBtn = document.getElementById("startWave");
const toggleSpeedBtn = document.getElementById("toggleSpeed");
const togglePauseBtn = document.getElementById("togglePause");
const toggleAutostartBtn = document.getElementById("toggleAutostart");
const towerListEl = document.getElementById("towerList");
const selectedInfoEl = document.getElementById("selectedInfo");
const selectedImageEl = document.getElementById("selectedImage");
const selectedNameEl = document.getElementById("selectedName");
const selectedDescEl = document.getElementById("selectedDesc");
const selectedCostEl = document.getElementById("selectedCost");
const selectedDamageEl = document.getElementById("selectedDamage");
const selectedRangeEl = document.getElementById("selectedRange");
const selectedRateEl = document.getElementById("selectedRate");
const overlayEl = document.getElementById("overlay");
const overlayTitleEl = document.getElementById("overlayTitle");
const overlayTextEl = document.getElementById("overlayText");
const restartBtn = document.getElementById("restart");
const loadingEl = document.getElementById("loading");
const hintEl = document.getElementById("hint");
const freeplayOverlayEl = document.getElementById("freeplayOverlay");
const freeplayYesBtn = document.getElementById("freeplayYes");
const freeplayNoBtn = document.getElementById("freeplayNo");
const upgradeTitleEl = document.getElementById("upgradeTitle");
const upgradeMetaEl = document.getElementById("upgradeMeta");
const clearSelectionBtn = document.getElementById("clearSelection");
const pathTitleEls = [
  document.getElementById("path0Title"),
  document.getElementById("path1Title"),
  document.getElementById("path2Title"),
];
const pathDescEls = [
  document.getElementById("path0Desc"),
  document.getElementById("path1Desc"),
  document.getElementById("path2Desc"),
];
const pathTierEls = [
  Array.from(document.querySelectorAll("#path0Tiers .tier")),
  Array.from(document.querySelectorAll("#path1Tiers .tier")),
  Array.from(document.querySelectorAll("#path2Tiers .tier")),
];
const pathUpgradeBtns = Array.from(document.querySelectorAll(".path-upgrade"));

const BASE_WIDTH = 960;
const BASE_HEIGHT = 540;
const GRID_COLS = 16;
const GRID_ROWS = 9;
const TILE = BASE_WIDTH / GRID_COLS;

const ASSETS = {
  schlingus: "images/towers/schlingus-body.png",
  turking: "images/towers/turking.png",
  pickleguy: "images/towers/pickleguy.png",
  luis: "images/towers/luisgamercool23.png",
  ducklord: "images/towers/th_ducklord.png",
  infernus: "images/enemies/infernus.png",
  luisEnemy: "images/enemies/luisgamercool23-head.png",
  redcliff: "images/enemies/redcliff.png",
  wannabe: "images/enemies/turking-wannabe.png",
  schlergus: "images/enemies/schlergus.png",
};

const TOWER_TYPES = {
  schlingus: {
    id: "schlingus",
    name: "Schlingus",
    cost: 90,
    damage: 7,
    range: 100,
    rate: 0.9,
    projectileSpeed: 320,
    color: "#9be06a",
    description: "Low-cost starter with steady shots.",
    paths: [
      {
        name: "Thorns",
        desc: "Damage-focused thistle shots.",
        tiers: [
          { damageAdd: 2 },
          { damageAdd: 3 },
          { damageAdd: 4 },
          { damageAdd: 6 },
          { damageAdd: 8 },
        ],
      },
      {
        name: "Canopy",
        desc: "Wider reach over the garden.",
        tiers: [
          { rangeAdd: 10 },
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
          { rangeAdd: 18 },
        ],
      },
      {
        name: "Breeze",
        desc: "Faster firing rhythm.",
        tiers: [
          { rateMul: 0.92 },
          { rateMul: 0.9 },
          { rateMul: 0.88 },
          { rateMul: 0.85 },
          { rateMul: 0.82 },
        ],
      },
    ],
  },
  turking: {
    id: "turking",
    name: "Turking",
    cost: 160,
    damage: 13,
    range: 125,
    rate: 0.85,
    projectileSpeed: 360,
    color: "#ffb35c",
    description: "Balanced fire for all-round coverage.",
    paths: [
      {
        name: "Blade",
        desc: "Sharper hits for elites.",
        tiers: [
          { damageAdd: 3 },
          { damageAdd: 4 },
          { damageAdd: 5 },
          { damageAdd: 7 },
          { damageAdd: 9 },
        ],
      },
      {
        name: "Sight",
        desc: "More sightlines around bends.",
        tiers: [
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
          { rangeAdd: 18 },
          { rangeAdd: 20 },
        ],
      },
      {
        name: "Tempo",
        desc: "Faster release cadence.",
        tiers: [
          { rateMul: 0.9 },
          { rateMul: 0.88 },
          { rateMul: 0.86 },
          { rateMul: 0.84 },
          { rateMul: 0.82 },
        ],
      },
    ],
  },
  pickleguy: {
    id: "pickleguy",
    name: "Pickleguy",
    cost: 220,
    damage: 21,
    range: 130,
    rate: 1.25,
    projectileSpeed: 300,
    color: "#6ee27b",
    description: "Heavy hits that punish clusters.",
    paths: [
      {
        name: "Smash",
        desc: "Heavier direct impacts.",
        tiers: [
          { damageAdd: 4 },
          { damageAdd: 5 },
          { damageAdd: 6 },
          { damageAdd: 8 },
          { damageAdd: 10 },
        ],
      },
      {
        name: "Arc",
        desc: "Longer throwing arc.",
        tiers: [
          { rangeAdd: 10 },
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
          { rangeAdd: 18 },
        ],
      },
      {
        name: "Shrapnel",
        desc: "Adds splash for clusters.",
        tiers: [
          { splashAdd: 18, damageAdd: 1 },
          { splashAdd: 26, damageAdd: 1 },
          { splashAdd: 36, damageAdd: 2 },
          { splashAdd: 48, damageAdd: 2 },
          { splashAdd: 62, damageAdd: 3 },
        ],
      },
    ],
  },
  luis: {
    id: "luis",
    name: "luisgamercool23",
    cost: 280,
    damage: 32,
    range: 175,
    rate: 1.75,
    projectileSpeed: 420,
    color: "#ffd166",
    description: "Long-range strikes for priority targets.",
    paths: [
      {
        name: "Overwatch",
        desc: "Harder hitting precision shots.",
        tiers: [
          { damageAdd: 5 },
          { damageAdd: 7 },
          { damageAdd: 9 },
          { damageAdd: 12 },
          { damageAdd: 15 },
        ],
      },
      {
        name: "Scope",
        desc: "Extreme range coverage.",
        tiers: [
          { rangeAdd: 15 },
          { rangeAdd: 18 },
          { rangeAdd: 22 },
          { rangeAdd: 26 },
          { rangeAdd: 30 },
        ],
      },
      {
        name: "Focus",
        desc: "Lower shot cooldown.",
        tiers: [
          { rateMul: 0.92 },
          { rateMul: 0.9 },
          { rateMul: 0.88 },
          { rateMul: 0.85 },
          { rateMul: 0.82 },
        ],
      },
    ],
  },
  ducklord: {
    id: "ducklord",
    name: "th_ducklord",
    cost: 340,
    damage: 18,
    range: 150,
    rate: 1.45,
    projectileSpeed: 300,
    splash: 70,
    slow: 1.1,
    color: "#6ac7ff",
    description: "Splash damage with a slowing mist.",
    paths: [
      {
        name: "Bloom",
        desc: "Bigger splash radius.",
        tiers: [
          { splashAdd: 12, slowAdd: 0.05 },
          { splashAdd: 16, slowAdd: 0.05 },
          { splashAdd: 20, slowAdd: 0.05 },
          { splashAdd: 26, slowAdd: 0.05 },
          { splashAdd: 34, slowAdd: 0.05 },
        ],
      },
      {
        name: "Frost",
        desc: "Heavier slow and reach.",
        tiers: [
          { slowAdd: 0.08, rangeAdd: 6 },
          { slowAdd: 0.1, rangeAdd: 8 },
          { slowAdd: 0.12, rangeAdd: 10 },
          { slowAdd: 0.14, rangeAdd: 12 },
          { slowAdd: 0.16, rangeAdd: 14 },
        ],
      },
      {
        name: "Surge",
        desc: "Faster fire with more sting.",
        tiers: [
          { rateMul: 0.93, damageAdd: 2 },
          { rateMul: 0.9, damageAdd: 3 },
          { rateMul: 0.88, damageAdd: 4 },
          { rateMul: 0.85, damageAdd: 5 },
          { rateMul: 0.82, damageAdd: 6 },
        ],
      },
    ],
  },
};

const ENEMY_TYPES = {
  infernus: {
    id: "infernus",
    name: "infernus",
    hp: 70,
    speed: 100,
    reward: 9,
    image: "infernus",
    size: 36,
  },
  wannabe: {
    id: "wannabe",
    name: "Turking Wannabe",
    hp: 95,
    speed: 85,
    reward: 12,
    image: "wannabe",
    size: 40,
  },
  redcliff: {
    id: "redcliff",
    name: "redcliff",
    hp: 200,
    speed: 54,
    reward: 20,
    image: "redcliff",
    size: 46,
  },
  luis: {
    id: "luis",
    name: "Decapitated luisgamercool23",
    hp: 300,
    speed: 40,
    reward: 24,
    image: "luisEnemy",
    size: 50,
  },
  schlergus: {
    id: "schlergus",
    name: "Schlergus, Garden Bane",
    hp: 1200,
    speed: 34,
    reward: 150,
    image: "schlergus",
    size: 70,
  },
};

const BASE_WAVES = [
  {
    name: "Garden Wake",
    reward: 25,
    groups: [{ type: "infernus", count: 5, interval: 1.0 }],
  },
  {
    name: "Sprout Rush",
    reward: 35,
    groups: [
      { type: "infernus", count: 8, interval: 0.9 },
      { type: "wannabe", count: 3, interval: 0.9 },
    ],
  },
  {
    name: "Runner Row",
    reward: 45,
    groups: [
      { type: "wannabe", count: 6, interval: 0.8 },
      { type: "infernus", count: 5, interval: 0.85 },
    ],
  },
  {
    name: "Redcliff Scout",
    reward: 55,
    groups: [
      { type: "redcliff", count: 2, interval: 1.4 },
      { type: "infernus", count: 8, interval: 0.8 },
    ],
  },
  {
    name: "Side Path",
    reward: 65,
    groups: [
      { type: "wannabe", count: 7, interval: 0.75 },
      { type: "infernus", count: 7, interval: 0.8 },
    ],
  },
  {
    name: "Heating Up",
    reward: 75,
    groups: [
      { type: "infernus", count: 10, interval: 0.7 },
      { type: "redcliff", count: 3, interval: 1.2 },
    ],
  },
  {
    name: "Luis Probe",
    reward: 85,
    groups: [
      { type: "luis", count: 1, interval: 1.6 },
      { type: "wannabe", count: 8, interval: 0.7 },
      { type: "infernus", count: 6, interval: 0.7 },
    ],
  },
  {
    name: "Brute Line",
    reward: 95,
    groups: [
      { type: "redcliff", count: 4, interval: 1.1 },
      { type: "infernus", count: 8, interval: 0.65 },
    ],
  },
  {
    name: "Mixed Bed",
    reward: 110,
    groups: [
      { type: "wannabe", count: 10, interval: 0.65 },
      { type: "infernus", count: 8, interval: 0.7 },
      { type: "redcliff", count: 3, interval: 1.1 },
    ],
  },
  {
    name: "Garden Gate",
    reward: 120,
    groups: [
      { type: "luis", count: 2, interval: 1.5 },
      { type: "redcliff", count: 4, interval: 1.0 },
      { type: "infernus", count: 8, interval: 0.65 },
    ],
  },
  {
    name: "Heat Bloom",
    reward: 135,
    groups: [
      { type: "infernus", count: 12, interval: 0.6 },
      { type: "wannabe", count: 8, interval: 0.6 },
      { type: "redcliff", count: 4, interval: 1.0 },
    ],
  },
  {
    name: "Tank Steps",
    reward: 150,
    groups: [
      { type: "luis", count: 3, interval: 1.4 },
      { type: "infernus", count: 10, interval: 0.6 },
      { type: "wannabe", count: 6, interval: 0.6 },
    ],
  },
  {
    name: "Double Bend",
    reward: 170,
    groups: [
      { type: "redcliff", count: 6, interval: 0.95 },
      { type: "wannabe", count: 10, interval: 0.55 },
    ],
  },
  {
    name: "Inferno Trail",
    reward: 190,
    groups: [
      { type: "infernus", count: 16, interval: 0.55 },
      { type: "luis", count: 2, interval: 1.3 },
      { type: "redcliff", count: 4, interval: 0.95 },
    ],
  },
  {
    name: "Brute Garden",
    reward: 210,
    groups: [
      { type: "redcliff", count: 8, interval: 0.9 },
      { type: "wannabe", count: 10, interval: 0.55 },
      { type: "infernus", count: 8, interval: 0.55 },
    ],
  },
  {
    name: "Luis Parade",
    reward: 230,
    groups: [
      { type: "luis", count: 4, interval: 1.2 },
      { type: "infernus", count: 12, interval: 0.55 },
    ],
  },
  {
    name: "Triple Push",
    reward: 250,
    groups: [
      { type: "wannabe", count: 14, interval: 0.5 },
      { type: "redcliff", count: 6, interval: 0.9 },
      { type: "luis", count: 3, interval: 1.2 },
    ],
  },
  {
    name: "Overgrowth",
    reward: 280,
    groups: [
      { type: "infernus", count: 18, interval: 0.5 },
      { type: "wannabe", count: 12, interval: 0.5 },
      { type: "redcliff", count: 6, interval: 0.85 },
    ],
  },
  {
    name: "Pressure Beds",
    reward: 320,
    groups: [
      { type: "luis", count: 5, interval: 1.1 },
      { type: "redcliff", count: 8, interval: 0.85 },
      { type: "infernus", count: 12, interval: 0.5 },
    ],
  },
  {
    name: "Schlergus Siege",
    reward: 500,
    groups: [
      { type: "infernus", count: 12, interval: 0.5 },
      { type: "wannabe", count: 10, interval: 0.5 },
      { type: "redcliff", count: 6, interval: 0.85 },
      { type: "luis", count: 4, interval: 1.1 },
      { type: "schlergus", count: 1, interval: 1.0 },
    ],
  },
];

const WAVES = BASE_WAVES.map((wave, index) => {
  const countScale = index === 0 ? 1.15 : index < 3 ? 1.3 : 1.45;
  const intervalScale = index === 0 ? 0.95 : index < 3 ? 0.9 : 0.8;
  return {
    ...wave,
    reward: Math.max(15, Math.round(wave.reward * 0.75)),
    groups: wave.groups.map((group) => ({
      ...group,
      count: Math.max(1, Math.round(group.count * countScale)),
      interval: Math.max(0.4, group.interval * intervalScale),
    })),
  };
});

const pathTiles = [
  { c: 0, r: 4 },
  { c: 1, r: 4 },
  { c: 2, r: 4 },
  { c: 3, r: 4 },
  { c: 3, r: 3 },
  { c: 3, r: 2 },
  { c: 4, r: 2 },
  { c: 5, r: 2 },
  { c: 6, r: 2 },
  { c: 7, r: 2 },
  { c: 7, r: 3 },
  { c: 7, r: 4 },
  { c: 7, r: 5 },
  { c: 8, r: 5 },
  { c: 9, r: 5 },
  { c: 10, r: 5 },
  { c: 10, r: 4 },
  { c: 10, r: 3 },
  { c: 10, r: 2 },
  { c: 10, r: 1 },
  { c: 11, r: 1 },
  { c: 12, r: 1 },
  { c: 13, r: 1 },
  { c: 14, r: 1 },
  { c: 15, r: 1 },
];

const pathSet = new Set(pathTiles.map((tile) => `${tile.c},${tile.r}`));

function pseudoRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildGardenDecor() {
  const decor = [];
  for (let r = 0; r < GRID_ROWS; r += 1) {
    for (let c = 0; c < GRID_COLS; c += 1) {
      if (pathSet.has(`${c},${r}`)) continue;
      const seed = c * 101 + r * 37;
      const roll = pseudoRandom(seed);
      if (roll < 0.12) {
        decor.push({
          type: "flower",
          x: c * TILE + TILE * 0.3 + pseudoRandom(seed + 2) * TILE * 0.4,
          y: r * TILE + TILE * 0.3 + pseudoRandom(seed + 3) * TILE * 0.4,
          color: roll < 0.04 ? "#ffd166" : roll < 0.08 ? "#ff8fab" : "#7afcff",
        });
      } else if (roll < 0.18) {
        decor.push({
          type: "shrub",
          x: c * TILE + TILE * 0.2 + pseudoRandom(seed + 4) * TILE * 0.6,
          y: r * TILE + TILE * 0.2 + pseudoRandom(seed + 5) * TILE * 0.6,
          size: 6 + pseudoRandom(seed + 6) * 10,
        });
      }
    }
  }
  return decor;
}

const gardenDecor = buildGardenDecor();

const view = {
  width: canvas.width,
  height: canvas.height,
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  dpr: 1,
};

const state = {
  money: 180,
  lives: 100,
  waveIndex: 0,
  inWave: false,
  waveTimer: 0,
  spawnEvents: [],
  activeWave: null,
  activeWaveScale: { hp: 1, speed: 1, reward: 1 },
  freeplay: false,
  awaitingFreeplayChoice: false,
  autoStart: false,
  speed: 1,
  paused: false,
  selectedTowerId: "schlingus",
  gameOver: false,
};

const DEFAULT_SCALE = { hp: 1, speed: 1, reward: 1 };
const MAX_PATH_TIERS = 5;
const PATH_COST_MULTS = [0.8, 1.2, 1.8, 2.6, 3.5];

let images = {};
let towers = [];
let enemies = [];
let projectiles = [];
let floaters = [];
let lastTime = 0;
let selectedPlacedTower = null;
let autoStartTimer = null;

const hover = {
  active: false,
  tile: null,
  x: 0,
  y: 0,
  valid: false,
};

function loadImages() {
  loadingEl.classList.add("active");
  const entries = Object.entries(ASSETS);
  return Promise.all(
    entries.map(
      ([key, src]) =>
        new Promise((resolve) => {
          const img = new Image();
          img.onload = () => resolve([key, img]);
          img.onerror = () => resolve([key, null]);
          img.src = src;
        })
    )
  ).then((loaded) => {
    images = loaded.reduce((acc, [key, img]) => {
      acc[key] = img;
      return acc;
    }, {});
    loadingEl.classList.remove("active");
  });
}

function tileCenter(c, r) {
  return {
    x: c * TILE + TILE / 2,
    y: r * TILE + TILE / 2,
  };
}

function buildPathPoints() {
  const points = [
    { x: -TILE / 2, y: tileCenter(pathTiles[0].c, pathTiles[0].r).y },
    ...pathTiles.map((tile) => tileCenter(tile.c, tile.r)),
    { x: BASE_WIDTH + TILE / 2, y: tileCenter(pathTiles[pathTiles.length - 1].c, pathTiles[pathTiles.length - 1].r).y },
  ];
  return points;
}

const pathPoints = buildPathPoints();
const pathSegments = [];
let pathLength = 0;

for (let i = 0; i < pathPoints.length - 1; i += 1) {
  const a = pathPoints[i];
  const b = pathPoints[i + 1];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  pathSegments.push({ a, b, len });
  pathLength += len;
}

function getPathPosition(distance) {
  let remaining = distance;
  for (const seg of pathSegments) {
    if (remaining <= seg.len) {
      const t = seg.len === 0 ? 0 : remaining / seg.len;
      return {
        x: seg.a.x + (seg.b.x - seg.a.x) * t,
        y: seg.a.y + (seg.b.y - seg.a.y) * t,
      };
    }
    remaining -= seg.len;
  }
  const last = pathSegments[pathSegments.length - 1];
  return { x: last.b.x, y: last.b.y };
}

function computeTowerStats(type, upgrades) {
  const stats = {
    damage: type.damage,
    range: type.range,
    rate: type.rate,
    projectileSpeed: type.projectileSpeed,
    splash: type.splash || 0,
    slow: type.slow || 0,
    color: type.color,
  };

  type.paths.forEach((path, pathIndex) => {
    const level = upgrades[pathIndex] || 0;
    for (let i = 0; i < level; i += 1) {
      const effect = path.tiers[i];
      if (!effect) continue;
      if (effect.damageAdd) stats.damage += effect.damageAdd;
      if (effect.damageMul) stats.damage *= effect.damageMul;
      if (effect.rangeAdd) stats.range += effect.rangeAdd;
      if (effect.rangeMul) stats.range *= effect.rangeMul;
      if (effect.rateMul) stats.rate *= effect.rateMul;
      if (effect.splashAdd) stats.splash += effect.splashAdd;
      if (effect.slowAdd) stats.slow += effect.slowAdd;
      if (effect.projectileSpeedAdd) stats.projectileSpeed += effect.projectileSpeedAdd;
    }
  });

  stats.damage = Math.max(1, Math.round(stats.damage));
  stats.range = Math.max(40, Math.round(stats.range));
  stats.rate = Math.max(type.rate * 0.5, Number(stats.rate.toFixed(2)));
  stats.splash = Math.max(0, Math.round(stats.splash));
  stats.slow = Math.max(0, Number(stats.slow.toFixed(2)));
  return stats;
}

function getBaseStats(type) {
  return computeTowerStats(type, [0, 0, 0]);
}

function getPathUpgradeCost(tower, pathIndex) {
  if (!tower) return null;
  const level = tower.upgrades[pathIndex];
  if (level >= MAX_PATH_TIERS) return null;
  const mult = PATH_COST_MULTS[level] || PATH_COST_MULTS[PATH_COST_MULTS.length - 1];
  return Math.round(tower.type.cost * mult);
}

function canUpgradePath(tower, pathIndex) {
  if (!tower) return false;
  const level = tower.upgrades[pathIndex];
  if (level >= MAX_PATH_TIERS) return false;
  const nextLevel = level + 1;
  const highPaths = tower.upgrades.filter((lvl) => lvl >= 3).length;
  if (nextLevel >= 3 && level < 3 && highPaths >= 2) return false;
  return true;
}

class Enemy {
  constructor(type, scale = DEFAULT_SCALE) {
    this.type = type;
    this.scale = scale;
    this.maxHp = Math.round(type.hp * scale.hp);
    this.hp = this.maxHp;
    this.speed = type.speed * scale.speed;
    this.reward = Math.max(1, Math.round(type.reward * scale.reward));
    this.distance = 0;
    this.pos = { ...pathPoints[0] };
    this.slowTimer = 0;
    this.dead = false;
  }

  update(dt) {
    if (this.dead) return;
    if (this.slowTimer > 0) {
      this.slowTimer = Math.max(0, this.slowTimer - dt);
    }
    const slowFactor = this.slowTimer > 0 ? 0.55 : 1;
    this.distance += this.speed * slowFactor * dt;
    if (this.distance >= pathLength) {
      this.dead = true;
      state.lives = Math.max(0, state.lives - 1);
      floaters.push({ x: this.pos.x, y: this.pos.y, text: "-1 Life", color: "#ff5f56", life: 1.1 });
      if (state.lives <= 0) {
        triggerGameOver("Game Over", "The garden has fallen.");
      }
      return;
    }
    this.pos = getPathPosition(this.distance);
  }
}

class Tower {
  constructor(type, c, r) {
    this.type = type;
    this.c = c;
    this.r = r;
    this.upgrades = [0, 0, 0];
    this.stats = computeTowerStats(type, this.upgrades);
    const center = tileCenter(c, r);
    this.x = center.x;
    this.y = center.y;
    this.cooldown = 0;
  }

  update(dt) {
    if (this.cooldown > 0) {
      this.cooldown -= dt;
      return;
    }
    const target = acquireTarget(this);
    if (!target) return;
    this.cooldown = this.stats.rate;
    projectiles.push(new Projectile(this, target));
  }
}

class Projectile {
  constructor(tower, target) {
    this.tower = tower;
    this.target = target;
    this.x = tower.x;
    this.y = tower.y;
    this.speed = tower.stats.projectileSpeed;
    this.damage = tower.stats.damage;
    this.color = tower.stats.color;
    this.splash = tower.stats.splash || 0;
    this.slow = tower.stats.slow || 0;
    this.dead = false;
  }

  update(dt) {
    if (this.dead || !this.target || this.target.dead) {
      this.dead = true;
      return;
    }
    const dx = this.target.pos.x - this.x;
    const dy = this.target.pos.y - this.y;
    const dist = Math.hypot(dx, dy);
    const travel = this.speed * dt;
    if (dist <= travel) {
      this.hit();
      return;
    }
    this.x += (dx / dist) * travel;
    this.y += (dy / dist) * travel;
  }

  hit() {
    if (this.splash > 0) {
      enemies.forEach((enemy) => {
        if (enemy.dead) return;
        const d = Math.hypot(enemy.pos.x - this.target.pos.x, enemy.pos.y - this.target.pos.y);
        if (d <= this.splash) {
          applyDamage(enemy, this.damage);
          if (this.slow > 0) enemy.slowTimer = Math.max(enemy.slowTimer, this.slow);
        }
      });
    } else {
      applyDamage(this.target, this.damage);
      if (this.slow > 0) this.target.slowTimer = Math.max(this.target.slowTimer, this.slow);
    }
    this.dead = true;
  }
}

function acquireTarget(tower) {
  let best = null;
  let bestDistance = -Infinity;
  for (const enemy of enemies) {
    if (enemy.dead) continue;
    const d = Math.hypot(enemy.pos.x - tower.x, enemy.pos.y - tower.y);
    if (d <= tower.stats.range && enemy.distance > bestDistance) {
      bestDistance = enemy.distance;
      best = enemy;
    }
  }
  return best;
}

function applyDamage(enemy, amount) {
  if (enemy.dead) return;
  enemy.hp -= amount;
  floaters.push({ x: enemy.pos.x, y: enemy.pos.y - 18, text: `-${amount}`, color: "#ffc857", life: 0.6 });
  if (enemy.hp <= 0) {
    enemy.dead = true;
    state.money += enemy.reward;
    floaters.push({ x: enemy.pos.x, y: enemy.pos.y + 8, text: `+$${enemy.reward}`, color: "#48e0c5", life: 0.9 });
  }
}

function showFreeplayPrompt() {
  state.awaitingFreeplayChoice = true;
  freeplayOverlayEl.classList.add("active");
}

function hideFreeplayPrompt() {
  state.awaitingFreeplayChoice = false;
  freeplayOverlayEl.classList.remove("active");
}

function scheduleAutoStart() {
  if (autoStartTimer) {
    clearTimeout(autoStartTimer);
  }
  autoStartTimer = setTimeout(() => {
    if (!state.autoStart) return;
    if (state.gameOver || state.inWave || state.paused) return;
    if (state.awaitingFreeplayChoice) return;
    if (state.waveIndex >= WAVES.length && !state.freeplay) return;
    startWave();
  }, 900);
}

function selectPlacedTower(tower) {
  selectedPlacedTower = tower;
  if (tower) {
    hintEl.textContent = `${tower.type.name} selected. Upgrade it or place more towers.`;
  }
}

function clearSelectedTower() {
  selectedPlacedTower = null;
  hintEl.textContent = "Tower deselected. Place a tower or select another.";
}

function upgradePath(pathIndex) {
  if (!selectedPlacedTower || state.gameOver) return;
  const canUpgrade = canUpgradePath(selectedPlacedTower, pathIndex);
  if (!canUpgrade) {
    hintEl.textContent = "That path is locked at tier 2.";
    return;
  }
  const cost = getPathUpgradeCost(selectedPlacedTower, pathIndex);
  if (!cost) {
    hintEl.textContent = "That path is already maxed.";
    return;
  }
  if (state.money < cost) {
    hintEl.textContent = "Not enough credits for that upgrade.";
    return;
  }
  selectedPlacedTower.upgrades[pathIndex] += 1;
  selectedPlacedTower.stats = computeTowerStats(selectedPlacedTower.type, selectedPlacedTower.upgrades);
  state.money -= cost;
  const totalTiers = selectedPlacedTower.upgrades.reduce((sum, lvl) => sum + lvl, 0);
  floaters.push({
    x: selectedPlacedTower.x,
    y: selectedPlacedTower.y - 10,
    text: `Tier ${totalTiers}`,
    color: "#48e0c5",
    life: 1.2,
  });
  hintEl.textContent = `${selectedPlacedTower.type.name} upgraded.`;
  syncUI();
}

function getWave(index) {
  if (index < WAVES.length) return WAVES[index];
  return buildFreeplayWave(index - WAVES.length + 1);
}

function buildFreeplayWave(stage) {
  const growth = Math.min(stage, 80);
  const base = 14 + Math.floor(growth * 2.4);
  const fastInterval = Math.max(0.3, 0.55 - growth * 0.01);
  const heavyInterval = Math.max(0.65, 1.05 - growth * 0.012);
  const reward = 140 + growth * 18;
  const scale = {
    hp: 1 + growth * 0.12,
    speed: 1 + growth * 0.025,
    reward: 1 + growth * 0.04,
  };

  const groups = [
    { type: "infernus", count: base, interval: fastInterval },
    { type: "wannabe", count: base, interval: Math.max(0.35, fastInterval - 0.02) },
    { type: "redcliff", count: Math.max(4, Math.floor(base * 0.45)), interval: heavyInterval },
    { type: "luis", count: Math.max(2, Math.floor(base * 0.25)), interval: Math.max(0.85, heavyInterval + 0.1) },
  ];

  if (stage % 5 === 0) {
    groups.push({ type: "schlergus", count: 1, interval: 1.2 });
  }

  return { name: `Freeplay ${stage}`, reward, groups, scale };
}

function buildSpawnEvents(wave) {
  const events = [];
  if (!wave || !wave.groups) return events;
  let time = 0;
  wave.groups.forEach((group) => {
    for (let i = 0; i < group.count; i += 1) {
      events.push({ time, type: group.type });
      time += group.interval;
    }
    time += 0.6;
  });
  return events;
}

function spawnEnemy(typeId) {
  const type = ENEMY_TYPES[typeId];
  if (!type) return;
  const scale = state.activeWaveScale || DEFAULT_SCALE;
  enemies.push(new Enemy(type, scale));
}

function startWave() {
  if (state.inWave || state.gameOver) return;
  if (state.waveIndex >= WAVES.length && !state.freeplay) {
    showFreeplayPrompt();
    return;
  }
  const wave = getWave(state.waveIndex);
  state.inWave = true;
  state.waveTimer = 0;
  state.activeWave = wave;
  state.activeWaveScale = wave.scale || DEFAULT_SCALE;
  state.spawnEvents = buildSpawnEvents(wave);
  hintEl.textContent = "Wave in progress. Keep the line tight.";
  syncUI();
}

function finishWave() {
  const wave = state.activeWave;
  state.inWave = false;
  state.activeWave = null;
  state.activeWaveScale = { ...DEFAULT_SCALE };
  state.waveIndex += 1;
  if (wave && wave.reward) {
    state.money += wave.reward;
    floaters.push({ x: BASE_WIDTH / 2, y: 60, text: `Wave Bonus +$${wave.reward}`, color: "#48e0c5", life: 1.4 });
  }
  if (!state.freeplay && state.waveIndex >= WAVES.length) {
    hintEl.textContent = "Campaign cleared. Choose if you want freeplay.";
    showFreeplayPrompt();
  } else {
    hintEl.textContent = "Wave cleared. Rebuild and press start when ready.";
    if (state.autoStart) scheduleAutoStart();
  }
  syncUI();
}

function triggerGameOver(title, message) {
  state.gameOver = true;
  state.paused = true;
  overlayTitleEl.textContent = title;
  overlayTextEl.textContent = message;
  overlayEl.classList.add("active");
  syncUI();
}

function resetGame() {
  towers = [];
  enemies = [];
  projectiles = [];
  floaters = [];
  state.money = 180;
  state.lives = 100;
  state.waveIndex = 0;
  state.inWave = false;
  state.waveTimer = 0;
  state.spawnEvents = [];
  state.activeWave = null;
  state.activeWaveScale = { ...DEFAULT_SCALE };
  state.freeplay = false;
  state.awaitingFreeplayChoice = false;
  state.autoStart = false;
  state.speed = 1;
  state.paused = false;
  state.selectedTowerId = "schlingus";
  state.gameOver = false;
  selectedPlacedTower = null;
  if (autoStartTimer) {
    clearTimeout(autoStartTimer);
    autoStartTimer = null;
  }
  hideFreeplayPrompt();
  overlayEl.classList.remove("active");
  hintEl.textContent = "Click a tower, then click a tile to deploy.";
  syncUI();
}

function update(dt) {
  if (state.paused || state.gameOver) return;

  if (state.inWave) {
    state.waveTimer += dt;
    while (state.spawnEvents.length && state.spawnEvents[0].time <= state.waveTimer) {
      const event = state.spawnEvents.shift();
      spawnEnemy(event.type);
    }
  }

  enemies.forEach((enemy) => enemy.update(dt));
  towers.forEach((tower) => tower.update(dt));
  projectiles.forEach((proj) => proj.update(dt));

  floaters.forEach((floater) => {
    floater.life -= dt;
    floater.y -= 24 * dt;
  });

  enemies = enemies.filter((enemy) => !enemy.dead);
  projectiles = projectiles.filter((proj) => !proj.dead);
  floaters = floaters.filter((floater) => floater.life > 0);

  if (state.inWave && state.spawnEvents.length === 0 && enemies.length === 0) {
    finishWave();
  }
}

function drawBackground() {
  const gradient = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
  gradient.addColorStop(0, "#1f4f2d");
  gradient.addColorStop(1, "#0f2b1a");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  ctx.save();
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = "#1b3f27";
  for (let i = 0; i < GRID_ROWS; i += 1) {
    if (i % 2 === 0) {
      ctx.fillRect(0, i * TILE, BASE_WIDTH, TILE);
    }
  }
  ctx.restore();

  gardenDecor.forEach((item) => {
    if (item.type === "flower") {
      ctx.save();
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(item.x, item.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.arc(item.x + 2, item.y - 1, 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else {
      ctx.save();
      ctx.fillStyle = "#1b6b2f";
      ctx.beginPath();
      ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  });
}

function drawGrid() {
  ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
  ctx.lineWidth = 1;
  for (let c = 0; c <= GRID_COLS; c += 1) {
    const x = c * TILE;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, BASE_HEIGHT);
    ctx.stroke();
  }
  for (let r = 0; r <= GRID_ROWS; r += 1) {
    const y = r * TILE;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(BASE_WIDTH, y);
    ctx.stroke();
  }
}

function drawPath() {
  ctx.fillStyle = "#b38b5d";
  pathTiles.forEach((tile) => {
    ctx.fillRect(tile.c * TILE, tile.r * TILE, TILE, TILE);
  });

  ctx.strokeStyle = "#8d6a44";
  ctx.lineWidth = 2;
  pathTiles.forEach((tile) => {
    ctx.strokeRect(tile.c * TILE + 3, tile.r * TILE + 3, TILE - 6, TILE - 6);
  });

  ctx.save();
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  pathPoints.forEach((pt, index) => {
    if (index % 2 === 0) {
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

function drawTowers() {
  towers.forEach((tower) => {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.beginPath();
    ctx.ellipse(tower.x, tower.y + 8, 26, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(tower.x, tower.y + 6, 24, 0, Math.PI * 2);
    ctx.stroke();

    const img = images[tower.type.id];
    if (img) {
      const size = 52;
      ctx.drawImage(img, tower.x - size / 2, tower.y - size / 2 - 6, size, size);
    } else {
      ctx.fillStyle = tower.stats.color;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y, 18, 0, Math.PI * 2);
      ctx.fill();
    }

    if (tower === selectedPlacedTower) {
      ctx.strokeStyle = "#48e0c5";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(tower.x, tower.y + 4, 28, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.beginPath();
    ctx.arc(tower.x + 18, tower.y - 18, 10, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "600 12px 'Space Grotesk', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${tower.upgrades.reduce((sum, lvl) => sum + lvl, 0)}`, tower.x + 18, tower.y - 18);
    ctx.restore();
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    const img = images[enemy.type.image];
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.beginPath();
    ctx.ellipse(enemy.pos.x, enemy.pos.y + 10, enemy.type.size * 0.5, enemy.type.size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    if (img) {
      ctx.drawImage(img, enemy.pos.x - enemy.type.size / 2, enemy.pos.y - enemy.type.size / 2, enemy.type.size, enemy.type.size);
    } else {
      ctx.fillStyle = "#ff8a3d";
      ctx.beginPath();
      ctx.arc(enemy.pos.x, enemy.pos.y, enemy.type.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    const barWidth = enemy.type.size * 0.9;
    const barHeight = 6;
    const healthRatio = Math.max(0, enemy.hp / enemy.maxHp);
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.fillRect(enemy.pos.x - barWidth / 2, enemy.pos.y - enemy.type.size / 2 - 12, barWidth, barHeight);
    ctx.fillStyle = healthRatio > 0.5 ? "#48e0c5" : healthRatio > 0.25 ? "#ffc857" : "#ff5f56";
    ctx.fillRect(enemy.pos.x - barWidth / 2, enemy.pos.y - enemy.type.size / 2 - 12, barWidth * healthRatio, barHeight);
    ctx.restore();
  });
}

function drawProjectiles() {
  projectiles.forEach((proj) => {
    ctx.save();
    ctx.fillStyle = proj.color;
    ctx.shadowColor = proj.color;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawFloaters() {
  floaters.forEach((floater) => {
    ctx.save();
    ctx.globalAlpha = Math.max(0, floater.life / 1.2);
    ctx.fillStyle = floater.color;
    ctx.font = "600 14px 'Space Grotesk', sans-serif";
    ctx.fillText(floater.text, floater.x, floater.y);
    ctx.restore();
  });
}

function drawHover() {
  if (!hover.active || !hover.tile) return;
  const tower = TOWER_TYPES[state.selectedTowerId];
  if (!tower) return;
  const center = tileCenter(hover.tile.c, hover.tile.r);
  ctx.save();
  ctx.globalAlpha = 0.25;
  ctx.strokeStyle = hover.valid ? "#48e0c5" : "#ff5f56";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const previewStats = getBaseStats(tower);
  ctx.arc(center.x, center.y, previewStats.range, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = hover.valid ? "rgba(72, 224, 197, 0.2)" : "rgba(255, 95, 86, 0.18)";
  ctx.fillRect(hover.tile.c * TILE + 2, hover.tile.r * TILE + 2, TILE - 4, TILE - 4);
  ctx.restore();
}

function render() {
  ctx.setTransform(view.dpr, 0, 0, view.dpr, 0, 0);
  ctx.clearRect(0, 0, view.width, view.height);
  ctx.save();
  ctx.translate(view.offsetX, view.offsetY);
  ctx.scale(view.scale, view.scale);

  drawBackground();
  drawPath();
  drawGrid();
  drawHover();
  drawTowers();
  drawProjectiles();
  drawEnemies();
  drawFloaters();

  ctx.restore();
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  update(delta * state.speed);
  render();
  syncUI();
  requestAnimationFrame(loop);
}

function syncUI() {
  moneyEl.textContent = `$${state.money}`;
  livesEl.textContent = state.lives;
  const waveNumber = state.waveIndex + 1;
  const wave = getWave(state.waveIndex);
  if (state.waveIndex < WAVES.length) {
    waveEl.textContent = `${waveNumber} / ${WAVES.length}`;
    waveCountEl.textContent = `${waveNumber} / ${WAVES.length}`;
    waveNameEl.textContent = `Wave ${waveNumber}: ${wave.name}`;
  } else if (!state.freeplay) {
    waveEl.textContent = `${WAVES.length} / ${WAVES.length}`;
    waveCountEl.textContent = `${WAVES.length} / ${WAVES.length}`;
    waveNameEl.textContent = "Campaign Complete";
  } else {
    const freeplayIndex = state.waveIndex - WAVES.length + 1;
    waveEl.textContent = `Freeplay ${freeplayIndex}`;
    waveCountEl.textContent = `Freeplay ${freeplayIndex}`;
    waveNameEl.textContent = `Freeplay ${freeplayIndex}: Endless Garden`;
  }
  if (state.inWave && state.spawnEvents.length > 0) {
    const nextEvent = state.spawnEvents[0];
    const remaining = Math.max(0, nextEvent.time - state.waveTimer);
    nextSpawnEl.textContent = `Next spawn in ${remaining.toFixed(1)}s`;
  } else if (state.inWave) {
    nextSpawnEl.textContent = "Final pushes...";
  } else {
    if (state.waveIndex >= WAVES.length && !state.freeplay) {
      nextSpawnEl.textContent = "Freeplay ready";
    } else {
      nextSpawnEl.textContent = "Awaiting orders";
    }
  }

  startWaveBtn.disabled = state.inWave || state.gameOver;
  if (state.inWave) {
    startWaveBtn.textContent = "Wave in progress";
  } else if (state.waveIndex >= WAVES.length && !state.freeplay) {
    startWaveBtn.textContent = "Enter Freeplay";
  } else {
    startWaveBtn.textContent = "Start Wave";
  }
  toggleSpeedBtn.textContent = state.speed === 1 ? "2x Speed" : "1x Speed";
  togglePauseBtn.textContent = state.paused ? "Resume" : "Pause";
  toggleAutostartBtn.textContent = state.autoStart ? "Autostart: On" : "Autostart: Off";

  const selected = TOWER_TYPES[state.selectedTowerId];
  if (selected) {
    selectedImageEl.src = ASSETS[selected.id];
    selectedNameEl.textContent = selected.name;
    selectedDescEl.textContent = selected.description;
    selectedCostEl.textContent = `$${selected.cost}`;
    const baseStats = getBaseStats(selected);
    selectedDamageEl.textContent = `${baseStats.damage}`;
    selectedRangeEl.textContent = `${baseStats.range}`;
    selectedRateEl.textContent = `${(1 / baseStats.rate).toFixed(2)} /s`;
  }

  towerListEl.querySelectorAll(".tower-card").forEach((card) => {
    const isActive = card.dataset.tower === state.selectedTowerId;
    card.classList.toggle("active", isActive);
  });

  if (!selectedPlacedTower) {
    upgradeTitleEl.textContent = "No tower selected";
    upgradeMetaEl.textContent = "Click a placed tower to upgrade it.";
    clearSelectionBtn.disabled = true;
    pathTitleEls.forEach((el) => {
      el.textContent = "Path";
    });
    pathDescEls.forEach((el) => {
      el.textContent = "-";
    });
    pathTierEls.forEach((tiers) => {
      tiers.forEach((tier) => {
        tier.classList.remove("active", "locked");
      });
    });
    pathUpgradeBtns.forEach((btn) => {
      btn.textContent = "Upgrade";
      btn.disabled = true;
    });
  } else {
    const placed = selectedPlacedTower;
    const highPaths = placed.upgrades.filter((lvl) => lvl >= 3).length;
    upgradeTitleEl.textContent = placed.type.name;
    upgradeMetaEl.textContent = "Only two paths can go past tier 2.";
    clearSelectionBtn.disabled = false;

    placed.type.paths.forEach((path, index) => {
      const level = placed.upgrades[index];
      const lockedAtTwo = highPaths >= 2 && level < 3;
      pathTitleEls[index].textContent = path.name;
      pathDescEls[index].textContent = path.desc;
      pathTierEls[index].forEach((tier, tierIndex) => {
        tier.classList.toggle("active", tierIndex < level);
        tier.classList.toggle("locked", lockedAtTwo && tierIndex >= 2);
      });

      const cost = getPathUpgradeCost(placed, index);
      const canUpgrade = canUpgradePath(placed, index);
      const button = pathUpgradeBtns[index];
      if (level >= MAX_PATH_TIERS) {
        button.textContent = "Maxed";
        button.disabled = true;
      } else if (!canUpgrade && lockedAtTwo && level >= 2) {
        button.textContent = "Locked at tier 2";
        button.disabled = true;
      } else if (!canUpgrade) {
        button.textContent = "Locked";
        button.disabled = true;
      } else {
        button.textContent = `Upgrade Tier ${level + 1} ($${cost})`;
        button.disabled = state.money < cost || state.gameOver;
      }
    });
  }
}

function resize() {
  const rect = canvas.getBoundingClientRect();
  view.dpr = window.devicePixelRatio || 1;
  view.width = rect.width;
  view.height = rect.height;
  canvas.width = Math.round(rect.width * view.dpr);
  canvas.height = Math.round(rect.height * view.dpr);
  view.scale = Math.min(rect.width / BASE_WIDTH, rect.height / BASE_HEIGHT);
  view.offsetX = (rect.width - BASE_WIDTH * view.scale) / 2;
  view.offsetY = (rect.height - BASE_HEIGHT * view.scale) / 2;
}

function toGameCoords(clientX, clientY) {
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left - view.offsetX) / view.scale;
  const y = (clientY - rect.top - view.offsetY) / view.scale;
  return { x, y };
}

function getTileFromCoords(x, y) {
  const c = Math.floor(x / TILE);
  const r = Math.floor(y / TILE);
  if (c < 0 || c >= GRID_COLS || r < 0 || r >= GRID_ROWS) return null;
  return { c, r };
}

function isBuildable(tile) {
  if (!tile) return false;
  if (pathSet.has(`${tile.c},${tile.r}`)) return false;
  if (towers.some((tower) => tower.c === tile.c && tower.r === tile.r)) return false;
  return true;
}

function getTowerAt(tile) {
  if (!tile) return null;
  return towers.find((tower) => tower.c === tile.c && tower.r === tile.r) || null;
}

function handleCanvasMove(event) {
  const coords = toGameCoords(event.clientX, event.clientY);
  hover.active = true;
  hover.x = coords.x;
  hover.y = coords.y;
  hover.tile = getTileFromCoords(coords.x, coords.y);
  hover.valid = isBuildable(hover.tile);
}

function handleCanvasLeave() {
  hover.active = false;
  hover.tile = null;
}

function handleCanvasClick(event) {
  if (state.gameOver) return;
  const coords = toGameCoords(event.clientX, event.clientY);
  const tile = getTileFromCoords(coords.x, coords.y);
  if (!tile) return;
  const existingTower = getTowerAt(tile);
  if (existingTower) {
    selectPlacedTower(existingTower);
    syncUI();
    return;
  }
  const towerType = TOWER_TYPES[state.selectedTowerId];
  if (!towerType) return;
  if (!isBuildable(tile)) {
    hintEl.textContent = "That tile is blocked. Try another spot.";
    return;
  }
  if (state.money < towerType.cost) {
    hintEl.textContent = "Not enough credits for that tower.";
    return;
  }
  const newTower = new Tower(towerType, tile.c, tile.r);
  towers.push(newTower);
  selectPlacedTower(newTower);
  state.money -= towerType.cost;
  hintEl.textContent = "Tower deployed. Lock down the bends.";
  syncUI();
}

function bindUI() {
  towerListEl.addEventListener("click", (event) => {
    const card = event.target.closest(".tower-card");
    if (!card) return;
    const towerId = card.dataset.tower;
    if (!TOWER_TYPES[towerId]) return;
    clearSelectedTower();
    state.selectedTowerId = towerId;
    hintEl.textContent = `Placing ${TOWER_TYPES[towerId].name}. Choose a tile.`;
    syncUI();
  });

  startWaveBtn.addEventListener("click", startWave);

  toggleSpeedBtn.addEventListener("click", () => {
    state.speed = state.speed === 1 ? 2 : 1;
    syncUI();
  });

  togglePauseBtn.addEventListener("click", () => {
    state.paused = !state.paused;
    syncUI();
  });

  toggleAutostartBtn.addEventListener("click", () => {
    state.autoStart = !state.autoStart;
    if (state.autoStart && !state.inWave && !state.gameOver) {
      scheduleAutoStart();
    }
    syncUI();
  });

  clearSelectionBtn.addEventListener("click", () => {
    clearSelectedTower();
    syncUI();
  });

  pathUpgradeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pathIndex = Number(btn.dataset.path);
      if (Number.isNaN(pathIndex)) return;
      upgradePath(pathIndex);
    });
  });

  freeplayYesBtn.addEventListener("click", () => {
    state.freeplay = true;
    hideFreeplayPrompt();
    hintEl.textContent = "Freeplay engaged. Brace yourself.";
    syncUI();
    startWave();
  });

  freeplayNoBtn.addEventListener("click", () => {
    hideFreeplayPrompt();
    hintEl.textContent = "Freeplay paused. Press start when you are ready.";
    syncUI();
  });

  restartBtn.addEventListener("click", () => {
    resetGame();
  });

  canvas.addEventListener("mousemove", handleCanvasMove);
  canvas.addEventListener("mouseleave", handleCanvasLeave);
  canvas.addEventListener("click", handleCanvasClick);
  canvas.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    clearSelectedTower();
    syncUI();
  });

  window.addEventListener("resize", resize);
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      state.paused = !state.paused;
      syncUI();
    }
  });
}

function init() {
  resize();
  bindUI();
  syncUI();
  requestAnimationFrame(loop);
}

loadImages().then(init);
