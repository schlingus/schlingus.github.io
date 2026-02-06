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
const titleOverlayEl = document.getElementById("titleOverlay");
const startGameBtn = document.getElementById("startGame");
const mapOverlayEl = document.getElementById("mapOverlay");
const mapOptionEls = Array.from(document.querySelectorAll(".map-option"));
const backToTitleBtn = document.getElementById("backToTitle");
const loadingEl = document.getElementById("loading");
const hintEl = document.getElementById("hint");
const freeplayOverlayEl = document.getElementById("freeplayOverlay");
const freeplayYesBtn = document.getElementById("freeplayYes");
const freeplayNoBtn = document.getElementById("freeplayNo");
const upgradeTitleEl = document.getElementById("upgradeTitle");
const upgradeMetaEl = document.getElementById("upgradeMeta");
const clearSelectionBtn = document.getElementById("clearSelection");
const sellTowerBtn = document.getElementById("sellTower");
const debugPanelEl = document.getElementById("debugPanel");
const debugAddMoneyBtn = document.getElementById("debugAddMoney");
const debugInfMoneyBtn = document.getElementById("debugInfMoney");
const debugHitboxesBtn = document.getElementById("debugHitboxes");
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

const BASE_WIDTH = 1200;
const BASE_HEIGHT = 675;
const GRID_COLS = 16;
const GRID_ROWS = 9;
const TILE = BASE_WIDTH / GRID_COLS;

const ASSETS = {
  schlingus: "images/towers/schlingus-body.png",
  superschlingus: "images/towers/superschlingus.png",
  turking: "images/towers/turking.png",
  pickleguy: "images/towers/pickleguy.png",
  tankman48: "images/towers/tankman48.png",
  oven: "images/towers/oven.png",
  floppywaffle: "images/towers/floppywaffle.png",
  caelum: "images/towers/caelum.png",
  luis: "images/towers/luisgamercool23.png",
  ducklord: "images/towers/th_ducklord.png",
  infernus: "images/enemies/infernus.png",
  "infernus-knockoff": "images/towers/infernus-knockoff.png",
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
    damage: 8,
    range: 105,
    rate: 0.9,
    projectileSpeed: 320,
    color: "#9be06a",
    description: "Low-cost starter with steady shots.",
    paths: [
      {
        name: "Thorns",
        desc: "Damage-focused thistle shots.",
        tiers: [
          { damageAdd: 1 },
          { damageAdd: 2 },
          { damageAdd: 3 },
          { damageAdd: 4 },
          { damageAdd: 5 },
        ],
      },
      {
        name: "Canopy",
        desc: "Wider reach over the garden.",
        tiers: [
          { rangeAdd: 8 },
          { rangeAdd: 10 },
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
        ],
      },
      {
        name: "Breeze",
        desc: "Faster firing rhythm.",
        tiers: [
          { rateMul: 0.95 },
          { rateMul: 0.93 },
          { rateMul: 0.9 },
          { rateMul: 0.88 },
          { rateMul: 0.86 },
        ],
      },
    ],
  },
  superschlingus: {
    id: "superschlingus",
    name: "superschlingus",
    cost: 600,
    damage: 7,
    range: 125,
    rate: 0.45,
    projectileSpeed: 420,
    color: "#9bc3ff",
    description: "Extremely fast shots with lower damage.",
    paths: [
      {
        name: "Overdrive",
        desc: "Even faster firing.",
        tiers: [
          { rateMul: 0.92 },
          { rateMul: 0.9 },
          { rateMul: 0.88 },
          { rateMul: 0.86 },
          { rateMul: 0.84 },
        ],
      },
      {
        name: "Power",
        desc: "Boosts shot damage.",
        tiers: [
          { damageAdd: 2 },
          { damageAdd: 3 },
          { damageAdd: 4 },
          { damageAdd: 5 },
          { damageAdd: 6 },
        ],
      },
      {
        name: "Scope",
        desc: "Wider engagement range.",
        tiers: [
          { rangeAdd: 8 },
          { rangeAdd: 10 },
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
        ],
      },
    ],
  },
  turking: {
    id: "turking",
    name: "Turking",
    cost: 170,
    damage: 14,
    range: 125,
    rate: 0.88,
    projectileSpeed: 360,
    color: "#ffb35c",
    description: "Balanced fire for all-round coverage.",
    paths: [
      {
        name: "Blade",
        desc: "Sharper hits for elites.",
        tiers: [
          { damageAdd: 2 },
          { damageAdd: 3 },
          { damageAdd: 4 },
          { damageAdd: 5 },
          { damageAdd: 6 },
        ],
      },
      {
        name: "Sight",
        desc: "More sightlines around bends.",
        tiers: [
          { rangeAdd: 10 },
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
          { rangeAdd: 18 },
        ],
      },
      {
        name: "Tempo",
        desc: "Faster release cadence.",
        tiers: [
          { rateMul: 0.93 },
          { rateMul: 0.91 },
          { rateMul: 0.89 },
          { rateMul: 0.87 },
          { rateMul: 0.85 },
        ],
      },
    ],
  },
  pickleguy: {
    id: "pickleguy",
    name: "Pickleguy",
    cost: 230,
    damage: 19,
    range: 125,
    rate: 1.3,
    projectileSpeed: 300,
    color: "#6ee27b",
    description: "Heavy hits that punish clusters.",
    paths: [
      {
        name: "Smash",
        desc: "Heavier direct impacts.",
        tiers: [
          { damageAdd: 3 },
          { damageAdd: 4 },
          { damageAdd: 5 },
          { damageAdd: 6 },
          { damageAdd: 7 },
        ],
      },
      {
        name: "Arc",
        desc: "Longer throwing arc.",
        tiers: [
          { rangeAdd: 8 },
          { rangeAdd: 10 },
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
        ],
      },
      {
        name: "Shrapnel",
        desc: "Adds splash for clusters.",
        tiers: [
          { splashAdd: 14, damageAdd: 1 },
          { splashAdd: 20, damageAdd: 1 },
          { splashAdd: 28, damageAdd: 2 },
          { splashAdd: 38, damageAdd: 2 },
          { splashAdd: 50, damageAdd: 3 },
        ],
      },
    ],
  },
  tankman48: {
    id: "tankman48",
    name: "tankman48",
    cost: 260,
    damage: 18,
    range: 130,
    rate: 1.6,
    projectileSpeed: 240,
    splash: 90,
    moneyMult: 0.15,
    color: "#ff7b7b",
    description: "Bomb cannon with heavy splash.",
    paths: [
      {
        name: "Blast",
        desc: "Bigger explosions.",
        tiers: [
          { splashAdd: 18, damageAdd: 2 },
          { splashAdd: 24, damageAdd: 2 },
          { splashAdd: 32, damageAdd: 3 },
          { splashAdd: 42, damageAdd: 4 },
          { splashAdd: 56, damageAdd: 5 },
        ],
      },
      {
        name: "Payload",
        desc: "Harder hitting shells.",
        tiers: [
          { damageAdd: 3 },
          { damageAdd: 4 },
          { damageAdd: 5 },
          { damageAdd: 7 },
          { damageAdd: 9 },
        ],
      },
      {
        name: "Reload",
        desc: "Faster reload cycle.",
        tiers: [
          { rateMul: 0.94 },
          { rateMul: 0.92 },
          { rateMul: 0.9 },
          { rateMul: 0.88 },
          { rateMul: 0.86 },
        ],
      },
    ],
  },
  oven: {
    id: "oven",
    name: "oven",
    cost: 180,
    damage: 6,
    range: 115,
    rate: 1.0,
    projectileSpeed: 300,
    burnDamage: 2,
    burnDuration: 4,
    color: "#ff9f68",
    description: "Weak hits that burn over time.",
    paths: [
      {
        name: "Embers",
        desc: "Stronger burn over time.",
        tiers: [
          { burnDamageAdd: 0.5, burnDurationAdd: 0.6 },
          { burnDamageAdd: 0.6, burnDurationAdd: 0.8 },
          { burnDamageAdd: 0.8, burnDurationAdd: 1.0 },
          { burnDamageAdd: 1.0, burnDurationAdd: 1.2 },
          { burnDamageAdd: 1.2, burnDurationAdd: 1.4 },
        ],
      },
      {
        name: "Draft",
        desc: "Reach farther and faster.",
        tiers: [
          { rangeAdd: 8, rateMul: 0.95 },
          { rangeAdd: 10, rateMul: 0.93 },
          { rangeAdd: 12, rateMul: 0.91 },
          { rangeAdd: 14, rateMul: 0.89 },
          { rangeAdd: 16, rateMul: 0.87 },
        ],
      },
      {
        name: "Soot",
        desc: "Adds a mild slow.",
        tiers: [
          { slowAdd: 0.3, damageAdd: 1 },
          { slowAdd: 0.4, damageAdd: 1 },
          { slowAdd: 0.5, damageAdd: 1 },
          { slowAdd: 0.6, damageAdd: 2 },
          { slowAdd: 0.7, damageAdd: 2 },
        ],
      },
    ],
  },
  floppywaffle: {
    id: "floppywaffle",
    name: "floppywaffle",
    cost: 210,
    damage: 5,
    range: 120,
    rate: 1.05,
    projectileSpeed: 320,
    slow: 2.6,
    color: "#7ac8ff",
    description: "Slows enemies with gentle hits.",
    paths: [
      {
        name: "Chill",
        desc: "Longer slow duration.",
        tiers: [
          { slowAdd: 0.6 },
          { slowAdd: 0.8 },
          { slowAdd: 1.0 },
          { slowAdd: 1.2 },
          { slowAdd: 1.4 },
        ],
      },
      {
        name: "Reach",
        desc: "Cover more garden paths.",
        tiers: [
          { rangeAdd: 8 },
          { rangeAdd: 10 },
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
        ],
      },
      {
        name: "Tempo",
        desc: "Quicker chilled shots.",
        tiers: [
          { rateMul: 0.94, damageAdd: 1 },
          { rateMul: 0.92, damageAdd: 1 },
          { rateMul: 0.9, damageAdd: 2 },
          { rateMul: 0.88, damageAdd: 2 },
          { rateMul: 0.86, damageAdd: 3 },
        ],
      },
    ],
  },
  caelum: {
    id: "caelum",
    name: "caelum",
    cost: 250,
    damage: 0,
    range: 150,
    rate: 2.6,
    projectileSpeed: 0,
    cloverDamage: 6,
    cloverRadius: 22,
    cloverCount: 4,
    color: "#6fe27c",
    description: "Plants four clovers on the track that damage enemies.",
    role: "clover",
    paths: [
      {
        name: "Fortune",
        desc: "Stronger clover strikes.",
        tiers: [
          { cloverDamageAdd: 2 },
          { cloverDamageAdd: 3 },
          { cloverDamageAdd: 4, cloverDamageMul: 1.12 },
          { cloverDamageAdd: 6, cloverDamageMul: 1.2 },
          { cloverDamageAdd: 8, cloverDamageMul: 1.3 },
        ],
      },
      {
        name: "Growth",
        desc: "Wider clover coverage.",
        tiers: [
          { cloverRadiusAdd: 4, rangeAdd: 10 },
          { cloverRadiusAdd: 6, rangeAdd: 12 },
          { cloverRadiusAdd: 8, rangeAdd: 14 },
          { cloverRadiusAdd: 10, rangeAdd: 16 },
          { cloverRadiusAdd: 12, rangeAdd: 18 },
        ],
      },
      {
        name: "Blessing",
        desc: "Lucky clovers hit harder.",
        tiers: [
          { cloverDamageMul: 1.1 },
          { cloverDamageMul: 1.2 },
          { cloverDamageMul: 1.35 },
          { cloverDamageMul: 1.55 },
          { cloverDamageMul: 1.8 },
        ],
      },
    ],
  },
  "infernus-knockoff": {
    id: "infernus-knockoff",
    name: "infernus",
    cost: 320,
    damage: 30,
    range: 175,
    rate: 1.8,
    projectileSpeed: 420,
    color: "#ffd166",
    description: "Long-range strikes for priority targets.",
    paths: [
      {
        name: "Overwatch",
        desc: "Harder hitting precision shots.",
        tiers: [
          { damageAdd: 4 },
          { damageAdd: 5 },
          { damageAdd: 6 },
          { damageAdd: 8 },
          { damageAdd: 10 },
        ],
      },
      {
        name: "Scope",
        desc: "Extreme range coverage.",
        tiers: [
          { rangeAdd: 12 },
          { rangeAdd: 14 },
          { rangeAdd: 16 },
          { rangeAdd: 18 },
          { rangeAdd: 20 },
        ],
      },
      {
        name: "Focus",
        desc: "Lower shot cooldown.",
        tiers: [
          { rateMul: 0.94 },
          { rateMul: 0.92 },
          { rateMul: 0.9 },
          { rateMul: 0.88 },
          { rateMul: 0.86 },
        ],
      },
    ],
  },
  ducklord: {
    id: "ducklord",
    name: "th_ducklord",
    cost: 520,
    damage: 0,
    range: 0,
    rate: 4.2,
    projectileSpeed: 0,
    income: 35,
    incomeInterval: 4.2,
    color: "#6ac7ff",
    description: "Duck farm. Click ducks to collect.",
    role: "farm",
    paths: [
      {
        name: "Orchard",
        desc: "Bigger payouts each cycle.",
        tiers: [
          { incomeAdd: 6 },
          { incomeAdd: 8 },
          { incomeAdd: 10 },
          { incomeAdd: 12 },
          { incomeAdd: 15 },
        ],
      },
      {
        name: "Trade",
        desc: "Boost overall earnings.",
        tiers: [
          { incomeMul: 1.08 },
          { incomeMul: 1.12 },
          { incomeMul: 1.18 },
          { incomeMul: 1.25 },
          { incomeMul: 1.35 },
        ],
      },
      {
        name: "Automation",
        desc: "Faster payout cycles.",
        tiers: [
          { incomeIntervalMul: 0.92 },
          { incomeIntervalMul: 0.88 },
          { incomeIntervalMul: 0.84 },
          { incomeIntervalMul: 0.8 },
          { incomeIntervalMul: 0.76 },
        ],
      },
    ],
  },
};

const ENEMY_TYPES = {
  infernus: {
    id: "infernus",
    name: "infernus",
    hp: 26,
    speed: 70,
    reward: 4,
    image: "infernus",
    size: 36,
  },
  wannabe: {
    id: "wannabe",
    name: "Turking Wannabe",
    hp: 36,
    speed: 52,
    reward: 5,
    image: "wannabe",
    size: 40,
  },
  redcliff: {
    id: "redcliff",
    name: "redcliff",
    hp: 85,
    speed: 30,
    reward: 9,
    image: "redcliff",
    size: 46,
  },
  luis: {
    id: "luis",
    name: "Decapitated luisgamercool23",
    hp: 115,
    speed: 30,
    reward: 12,
    image: "luisEnemy",
    size: 50,
  },
  schlergus: {
    id: "schlergus",
    name: "Schlergus, Garden Bane",
    hp: 500,
    speed: 16,
    reward: 80,
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

const MAPS = [
  {
    id: "garden",
    name: "Garden Gate",
    description: "Classic winding path.",
    theme: {
      grassTop: "#204f2a",
      grassMid: "#12341e",
      grassBottom: "#0c2116",
      pathOuter: "#9e7546",
      pathInner: "#c79b63",
      pathDash: "rgba(70, 45, 20, 0.35)",
      light: "rgba(255, 226, 170, 0.45)",
      vignette: "rgba(0,0,0,0.45)",
      stone: "rgba(255, 255, 255, 0.35)",
      patternBase: "#144628",
      patternMin: 70,
      patternMax: 150,
    },
    pathTiles: [
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
    ],
  },
  {
    id: "orchard",
    name: "Orchard Loop",
    description: "Long loop with heavy corners.",
    theme: {
      grassTop: "#3b3a20",
      grassMid: "#292513",
      grassBottom: "#181408",
      pathOuter: "#8b5a2b",
      pathInner: "#b57b45",
      pathDash: "rgba(85, 50, 20, 0.35)",
      light: "rgba(255, 200, 140, 0.35)",
      vignette: "rgba(0,0,0,0.5)",
      stone: "rgba(255, 242, 220, 0.28)",
      patternBase: "#2e3a1b",
      patternMin: 60,
      patternMax: 140,
    },
    pathTiles: [
      { c: 0, r: 2 },
      { c: 1, r: 2 },
      { c: 2, r: 2 },
      { c: 3, r: 2 },
      { c: 4, r: 2 },
      { c: 5, r: 2 },
      { c: 5, r: 3 },
      { c: 5, r: 4 },
      { c: 5, r: 5 },
      { c: 5, r: 6 },
      { c: 6, r: 6 },
      { c: 7, r: 6 },
      { c: 8, r: 6 },
      { c: 9, r: 6 },
      { c: 10, r: 6 },
      { c: 11, r: 6 },
      { c: 11, r: 5 },
      { c: 11, r: 4 },
      { c: 11, r: 3 },
      { c: 12, r: 3 },
      { c: 13, r: 3 },
      { c: 14, r: 3 },
      { c: 15, r: 3 },
    ],
  },
  {
    id: "moonlit",
    name: "Moonlit Hedge",
    description: "Fast lanes and deep bends.",
    theme: {
      grassTop: "#1a3b4c",
      grassMid: "#112733",
      grassBottom: "#0a1820",
      pathOuter: "#6b6f7a",
      pathInner: "#8f949c",
      pathDash: "rgba(40, 50, 70, 0.35)",
      light: "rgba(120, 180, 255, 0.25)",
      vignette: "rgba(0,0,0,0.55)",
      stone: "rgba(220, 235, 255, 0.25)",
      patternBase: "#142c3a",
      patternMin: 55,
      patternMax: 130,
    },
    pathTiles: [
      { c: 0, r: 5 },
      { c: 1, r: 5 },
      { c: 2, r: 5 },
      { c: 3, r: 5 },
      { c: 3, r: 4 },
      { c: 3, r: 3 },
      { c: 3, r: 2 },
      { c: 3, r: 1 },
      { c: 4, r: 1 },
      { c: 5, r: 1 },
      { c: 6, r: 1 },
      { c: 7, r: 1 },
      { c: 8, r: 1 },
      { c: 9, r: 1 },
      { c: 10, r: 1 },
      { c: 11, r: 1 },
      { c: 12, r: 1 },
      { c: 12, r: 2 },
      { c: 12, r: 3 },
      { c: 12, r: 4 },
      { c: 12, r: 5 },
      { c: 12, r: 6 },
      { c: 12, r: 7 },
      { c: 13, r: 7 },
      { c: 14, r: 7 },
      { c: 15, r: 7 },
    ],
  },
];

let currentMap = MAPS[0];
let selectedMapId = MAPS[0].id;
let pathTiles = [];
let pathSet = new Set();
let gardenDecor = [];
let pathDecor = [];
let pathPoints = [];
let pathSegments = [];
let pathLength = 0;

function getTheme() {
  return currentMap && currentMap.theme ? currentMap.theme : {};
}

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

function buildPathDecor() {
  const stones = [];
  pathTiles.forEach((tile, index) => {
    const seed = index * 53 + tile.c * 13 + tile.r * 7;
    const count = 2 + Math.floor(pseudoRandom(seed) * 3);
    for (let i = 0; i < count; i += 1) {
      const jitterX = (pseudoRandom(seed + i * 3) - 0.5) * TILE * 0.6;
      const jitterY = (pseudoRandom(seed + i * 5) - 0.5) * TILE * 0.6;
      stones.push({
        x: tile.c * TILE + TILE / 2 + jitterX,
        y: tile.r * TILE + TILE / 2 + jitterY,
        r: 2 + pseudoRandom(seed + i * 11) * 3,
      });
    }
  });
  return stones;
}

let grassPattern = null;

function getGrassPattern() {
  if (grassPattern) return grassPattern;
  const theme = getTheme();
  const patternCanvas = document.createElement("canvas");
  patternCanvas.width = 90;
  patternCanvas.height = 90;
  const pctx = patternCanvas.getContext("2d");
  pctx.fillStyle = theme.patternBase || "#144628";
  pctx.fillRect(0, 0, patternCanvas.width, patternCanvas.height);
  const minG = theme.patternMin ?? 70;
  const maxG = theme.patternMax ?? 150;
  for (let i = 0; i < 240; i += 1) {
    const x = pseudoRandom(i * 7) * patternCanvas.width;
    const y = pseudoRandom(i * 11) * patternCanvas.height;
    const w = 1 + pseudoRandom(i * 13) * 2;
    const h = 6 + pseudoRandom(i * 17) * 10;
    const g = minG + Math.floor(pseudoRandom(i * 19) * (maxG - minG));
    pctx.fillStyle = `rgba(20, ${g}, 40, 0.35)`;
    pctx.fillRect(x, y, w, h);
  }
  for (let i = 0; i < 120; i += 1) {
    const x = pseudoRandom(i * 23) * patternCanvas.width;
    const y = pseudoRandom(i * 29) * patternCanvas.height;
    pctx.fillStyle = "rgba(255,255,255,0.03)";
    pctx.beginPath();
    pctx.arc(x, y, 0.8 + pseudoRandom(i * 31) * 1.4, 0, Math.PI * 2);
    pctx.fill();
  }
  grassPattern = ctx.createPattern(patternCanvas, "repeat");
  return grassPattern;
}

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
  debug: {
    unlocked: false,
    infMoney: false,
    showHitboxes: false,
  },
  speed: 1,
  paused: true,
  started: false,
  selectedTowerId: "schlingus",
  gameOver: false,
};

const DEFAULT_SCALE = { hp: 1, speed: 1, reward: 1 };
const MAX_PATH_TIERS = 5;
const PATH_COST_MULTS = [0.8, 1.2, 1.8, 2.6, 3.5];
const SELL_RATIO = 0.7;
const TOWER_RADIUS = 26;
const DUCK_DROP_LIFETIME = 5;
const DUCK_DROP_RADIUS = 14;

let images = {};
let towers = [];
let enemies = [];
let projectiles = [];
let floaters = [];
let duckDrops = [];
let clovers = [];
let lastTime = 0;
let selectedPlacedTower = null;
let autoStartTimer = null;
let debugBuffer = "";
const DEBUG_SEQUENCE = "CAELUM";
let enemyIdCounter = 1;
let gameLoading = false;
let gameLoaded = false;
const MAX_FRAME_DT = 0.06;

const hover = {
  active: false,
  x: 0,
  y: 0,
  tower: null,
  valid: false,
};

function removeImageBackground(img, tolerance = 24) {
  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  const c = canvas.getContext("2d");
  c.drawImage(img, 0, 0);
  const imageData = c.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];
  const tolSq = tolerance * tolerance;
  for (let i = 0; i < data.length; i += 4) {
    const dr = data[i] - bgR;
    const dg = data[i + 1] - bgG;
    const db = data[i + 2] - bgB;
    if (dr * dr + dg * dg + db * db <= tolSq) {
      data[i + 3] = 0;
    }
  }
  c.putImageData(imageData, 0, 0);
  return canvas;
}

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
    if (images.superschlingus) {
      images.superschlingus = removeImageBackground(images.superschlingus, 26);
    }
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

function buildPathSegments(points) {
  const segments = [];
  let total = 0;
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = points[i];
    const b = points[i + 1];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    segments.push({ a, b, len });
    total += len;
  }
  return { segments, length: total };
}

function applyMap(mapId) {
  const map = MAPS.find((item) => item.id === mapId) || MAPS[0];
  currentMap = map;
  pathTiles = map.pathTiles;
  pathSet = new Set(pathTiles.map((tile) => `${tile.c},${tile.r}`));
  pathPoints = buildPathPoints();
  const built = buildPathSegments(pathPoints);
  pathSegments = built.segments;
  pathLength = built.length;
  gardenDecor = buildGardenDecor();
  pathDecor = buildPathDecor();
  grassPattern = null;
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
    burnDamage: type.burnDamage || 0,
    burnDuration: type.burnDuration || 0,
    income: type.income || 0,
    incomeInterval: type.incomeInterval || 0,
    cloverDamage: type.cloverDamage || 0,
    cloverRadius: type.cloverRadius || 0,
    cloverCount: type.cloverCount || 0,
    moneyMult: type.moneyMult ?? 1,
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
      if (effect.burnDamageAdd) stats.burnDamage += effect.burnDamageAdd;
      if (effect.burnDurationAdd) stats.burnDuration += effect.burnDurationAdd;
      if (effect.incomeAdd) stats.income += effect.incomeAdd;
      if (effect.incomeMul) stats.income *= effect.incomeMul;
      if (effect.incomeIntervalMul) stats.incomeInterval *= effect.incomeIntervalMul;
      if (effect.incomeIntervalAdd) stats.incomeInterval += effect.incomeIntervalAdd;
      if (effect.cloverDamageAdd) stats.cloverDamage += effect.cloverDamageAdd;
      if (effect.cloverDamageMul) stats.cloverDamage *= effect.cloverDamageMul;
      if (effect.cloverRadiusAdd) stats.cloverRadius += effect.cloverRadiusAdd;
      if (effect.cloverCountAdd) stats.cloverCount += effect.cloverCountAdd;
      if (effect.projectileSpeedAdd) stats.projectileSpeed += effect.projectileSpeedAdd;
    }
  });

  const minDamage = type.damage === 0 ? 0 : 1;
  const minRange = type.range === 0 ? 0 : 40;
  stats.damage = Math.max(minDamage, Math.round(stats.damage));
  stats.range = Math.max(minRange, Math.round(stats.range));
  stats.rate = Math.max(type.rate * 0.5, Number(stats.rate.toFixed(2)));
  stats.splash = Math.max(0, Math.round(stats.splash));
  stats.slow = Math.max(0, Number(stats.slow.toFixed(2)));
  stats.burnDamage = Math.max(0, Number(stats.burnDamage.toFixed(2)));
  stats.burnDuration = Math.max(0, Number(stats.burnDuration.toFixed(2)));
  stats.income = Math.max(0, Math.round(stats.income));
  stats.incomeInterval = stats.incomeInterval > 0 ? Math.max(0.8, Number(stats.incomeInterval.toFixed(2))) : 0;
  stats.cloverDamage = Math.max(0, Number(stats.cloverDamage.toFixed(2)));
  stats.cloverRadius = Math.max(0, Number(stats.cloverRadius.toFixed(2)));
  stats.cloverCount = Math.max(0, Math.round(stats.cloverCount));
  if (type.role === "farm") {
    stats.damage = 0;
    stats.range = 0;
    stats.rate = stats.incomeInterval || stats.rate;
  }
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

function getTowerTotalSpent(tower) {
  if (!tower) return 0;
  let total = tower.type.cost;
  tower.upgrades.forEach((level) => {
    for (let i = 0; i < level; i += 1) {
      const mult = PATH_COST_MULTS[i] || PATH_COST_MULTS[PATH_COST_MULTS.length - 1];
      total += tower.type.cost * mult;
    }
  });
  return Math.round(total);
}

function getTowerSellValue(tower) {
  return Math.round(getTowerTotalSpent(tower) * SELL_RATIO);
}

function spawnDuckDrop(tower, value) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 10 + Math.random() * 16;
  duckDrops.push({
    x: tower.x + Math.cos(angle) * radius,
    y: tower.y + Math.sin(angle) * radius,
    value,
    life: DUCK_DROP_LIFETIME,
    maxLife: DUCK_DROP_LIFETIME,
  });
}

function getRandomPathPointInRange(tower) {
  const candidates = [];
  for (const tile of pathTiles) {
    const pt = tileCenter(tile.c, tile.r);
    if (Math.hypot(pt.x - tower.x, pt.y - tower.y) <= tower.stats.range) {
      candidates.push(pt);
    }
  }
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function spawnClover(tower) {
  const point = getRandomPathPointInRange(tower);
  if (!point) return;
  clovers.push({
    x: point.x,
    y: point.y,
    tower,
  });
}

function canAfford(cost) {
  if (state.debug && state.debug.infMoney) return true;
  return state.money >= cost;
}

function spend(cost) {
  if (state.debug && state.debug.infMoney) return;
  state.money -= cost;
}

function unlockDebugMode() {
  if (state.debug.unlocked) return;
  state.debug.unlocked = true;
  if (debugPanelEl) debugPanelEl.hidden = false;
  hintEl.textContent = "Debug mode unlocked.";
}

function handleDebugSequence(key) {
  if (key.length !== 1) return;
  const upper = key.toUpperCase();
  if (upper < "A" || upper > "Z") return;
  debugBuffer = `${debugBuffer}${upper}`.slice(-DEBUG_SEQUENCE.length);
  if (debugBuffer === DEBUG_SEQUENCE) {
    unlockDebugMode();
    debugBuffer = "";
  }
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
    this.id = enemyIdCounter++;
    this.scale = scale;
    this.maxHp = Math.round(type.hp * scale.hp);
    this.hp = this.maxHp;
    this.speed = type.speed * scale.speed;
    this.reward = Math.max(1, Math.round(type.reward * scale.reward));
    this.rewardBank = 0;
    this.paidReward = 0;
    this.distance = 0;
    this.pos = { ...pathPoints[0] };
    this.slowTimer = 0;
    this.burnTimer = 0;
    this.burnDps = 0;
    this.burnMoneyMult = 1;
    this.dead = false;
  }

  update(dt) {
    if (this.dead) return;
    if (this.burnTimer > 0) {
      this.burnTimer = Math.max(0, this.burnTimer - dt);
      const burnDamage = this.burnDps * dt;
      if (burnDamage > 0) {
        applyDamage(this, burnDamage, {
          silent: true,
          suppressRewardFloater: true,
          moneyMult: this.burnMoneyMult || 1,
        });
        if (this.dead) return;
      }
    }
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
  constructor(type, x, y) {
    this.type = type;
    this.upgrades = [0, 0, 0];
    this.stats = computeTowerStats(type, this.upgrades);
    this.x = x;
    this.y = y;
    this.cooldown = 0;
    this.incomeCooldown = this.stats.incomeInterval || 0;
    this.cloverCooldown = this.stats.rate;
  }

  update(dt) {
    if (this.stats.income > 0 && this.stats.incomeInterval > 0) {
      this.incomeCooldown -= dt;
      if (this.incomeCooldown <= 0) {
        const payouts = Math.floor(Math.abs(this.incomeCooldown) / this.stats.incomeInterval) + 1;
        this.incomeCooldown += this.stats.incomeInterval * payouts;
        for (let i = 0; i < payouts; i += 1) {
          spawnDuckDrop(this, this.stats.income);
        }
      }
    }
    if (this.type.role === "farm") return;
    if (this.type.role === "clover") {
      if (!state.inWave) return;
      this.cloverCooldown -= dt;
      if (this.cloverCooldown <= 0) {
        const maxClover = this.stats.cloverCount || 0;
        const currentClover = clovers.filter((clover) => clover.tower === this).length;
        if (currentClover < maxClover) {
          spawnClover(this);
        }
        this.cloverCooldown = Math.max(0.4, this.stats.rate);
      }
      return;
    }
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
    this.burnDamage = tower.stats.burnDamage || 0;
    this.burnDuration = tower.stats.burnDuration || 0;
    this.moneyMult = tower.stats.moneyMult || 1;
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
    const applyEffects = (enemy) => {
      if (this.slow > 0) enemy.slowTimer = Math.max(enemy.slowTimer, this.slow);
      if (this.burnDamage > 0 && this.burnDuration > 0) {
        enemy.burnTimer = Math.max(enemy.burnTimer, this.burnDuration);
        enemy.burnDps = Math.max(enemy.burnDps, this.burnDamage);
        enemy.burnMoneyMult = Math.max(enemy.burnMoneyMult || 1, this.moneyMult);
      }
    };

    if (this.splash > 0) {
      enemies.forEach((enemy) => {
        if (enemy.dead) return;
        const d = Math.hypot(enemy.pos.x - this.target.pos.x, enemy.pos.y - this.target.pos.y);
        if (d <= this.splash) {
          applyDamage(enemy, this.damage, { moneyMult: this.moneyMult });
          applyEffects(enemy);
        }
      });
    } else {
      applyDamage(this.target, this.damage, { moneyMult: this.moneyMult });
      applyEffects(this.target);
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

function addMoney(amount, x, y, showFloater = true) {
  if (amount <= 0) return;
  state.money += amount;
  if (showFloater) {
    floaters.push({ x, y, text: `+$${amount}`, color: "#48e0c5", life: 0.7 });
  }
}

function rewardDamage(enemy, amount, options = {}) {
  if (enemy.dead) return;
  const mult = options.moneyMult ?? 1;
  const payout = (amount / enemy.maxHp) * enemy.reward * mult;
  enemy.rewardBank += payout;
  const whole = Math.floor(enemy.rewardBank + 1e-6);
  if (whole > 0) {
    addMoney(whole, enemy.pos.x, enemy.pos.y + 8, !options.suppressRewardFloater);
    enemy.rewardBank -= whole;
    enemy.paidReward += whole;
  }
}

function rewardKill(enemy) {
  if (enemy.dead) return;
  enemy.dead = true;
  enemy.rewardBank = 0;
}

function applyDamage(enemy, amount, options = {}) {
  if (enemy.dead) return;
  const actual = Math.min(amount, enemy.hp);
  if (actual <= 0) return;
  enemy.hp -= actual;
  if (!options.silent) {
    const displayDamage = Math.round(actual);
    if (displayDamage > 0) {
      floaters.push({ x: enemy.pos.x, y: enemy.pos.y - 18, text: `-${displayDamage}`, color: "#ffc857", life: 0.6 });
    }
  }
  rewardDamage(enemy, actual, options);
  if (enemy.hp <= 0) {
    rewardKill(enemy);
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
  if (!canAfford(cost)) {
    hintEl.textContent = "Not enough credits for that upgrade.";
    return;
  }
  selectedPlacedTower.upgrades[pathIndex] += 1;
  selectedPlacedTower.stats = computeTowerStats(selectedPlacedTower.type, selectedPlacedTower.upgrades);
  if (selectedPlacedTower.stats.incomeInterval > 0) {
    selectedPlacedTower.incomeCooldown = Math.min(
      selectedPlacedTower.incomeCooldown,
      selectedPlacedTower.stats.incomeInterval
    );
  }
  if (selectedPlacedTower.type.role === "clover") {
    selectedPlacedTower.cloverCooldown = Math.min(
      selectedPlacedTower.cloverCooldown,
      Math.max(0.4, selectedPlacedTower.stats.rate)
    );
  }
  spend(cost);
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

function sellSelectedTower() {
  if (!selectedPlacedTower || state.gameOver) return;
  const sellValue = getTowerSellValue(selectedPlacedTower);
  state.money += sellValue;
  towers = towers.filter((tower) => tower !== selectedPlacedTower);
  clovers = clovers.filter((clover) => clover.tower !== selectedPlacedTower);
  floaters.push({
    x: selectedPlacedTower.x,
    y: selectedPlacedTower.y - 10,
    text: `+$${sellValue}`,
    color: "#48e0c5",
    life: 1.0,
  });
  hintEl.textContent = `${selectedPlacedTower.type.name} sold.`;
  selectedPlacedTower = null;
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

  if (stage >= 1) {
    const bossCount = stage % 10 === 0 ? 2 : 1;
    groups.push({ type: "schlergus", count: bossCount, interval: 1.2 });
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
  const baseScale = state.activeWaveScale || DEFAULT_SCALE;
  const gradualHpScale = 1 + state.waveIndex * 0.005;
  const scale = {
    ...baseScale,
    hp: baseScale.hp * gradualHpScale,
  };
  enemies.push(new Enemy(type, scale));
}

function startWave() {
  if (!state.started) return;
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
  duckDrops = [];
  clovers = [];
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
  state.paused = !state.started;
  state.selectedTowerId = "schlingus";
  state.gameOver = false;
  selectedPlacedTower = null;
  if (autoStartTimer) {
    clearTimeout(autoStartTimer);
    autoStartTimer = null;
  }
  hideFreeplayPrompt();
  overlayEl.classList.remove("active");
  if (!state.started && titleOverlayEl) {
    titleOverlayEl.classList.add("active");
  }
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

  if (clovers.length) {
    const remainingClovers = [];
    clovers.forEach((clover) => {
      const damage = clover.tower.stats.cloverDamage;
      const radius = clover.tower.stats.cloverRadius;
      if (damage <= 0 || radius <= 0) {
        remainingClovers.push(clover);
        return;
      }
      let consumed = false;
      for (const enemy of enemies) {
        if (enemy.dead) continue;
        const dx = enemy.pos.x - clover.x;
        const dy = enemy.pos.y - clover.y;
        if (dx * dx + dy * dy <= radius * radius) {
          applyDamage(enemy, damage, { moneyMult: clover.tower.stats.moneyMult || 1 });
          consumed = true;
          break;
        }
      }
      if (!consumed) remainingClovers.push(clover);
    });
    clovers = remainingClovers;
  }

  towers.forEach((tower) => tower.update(dt));
  projectiles.forEach((proj) => proj.update(dt));

  floaters.forEach((floater) => {
    floater.life -= dt;
    floater.y -= 24 * dt;
  });

  duckDrops.forEach((drop) => {
    drop.life -= dt;
  });

  duckDrops = duckDrops.filter((drop) => drop.life > 0);

  enemies = enemies.filter((enemy) => !enemy.dead);
  projectiles = projectiles.filter((proj) => !proj.dead);
  floaters = floaters.filter((floater) => floater.life > 0);

  if (state.inWave && state.spawnEvents.length === 0 && enemies.length === 0) {
    finishWave();
  }
}

function drawBackground() {
  const theme = getTheme();
  const gradient = ctx.createLinearGradient(0, 0, 0, BASE_HEIGHT);
  gradient.addColorStop(0, theme.grassTop || "#204f2a");
  gradient.addColorStop(0.55, theme.grassMid || "#12341e");
  gradient.addColorStop(1, theme.grassBottom || "#0c2116");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);

  const pattern = getGrassPattern();
  if (pattern) {
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
    ctx.restore();
  }

  // Removed grid-like striping overlay.

  ctx.save();
  ctx.globalAlpha = 0.2;
  const light = ctx.createRadialGradient(BASE_WIDTH * 0.25, BASE_HEIGHT * 0.2, 50, BASE_WIDTH * 0.25, BASE_HEIGHT * 0.2, 420);
  light.addColorStop(0, theme.light || "rgba(255, 226, 170, 0.45)");
  light.addColorStop(1, "rgba(255, 226, 170, 0)");
  ctx.fillStyle = light;
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  ctx.restore();

  // Removed colorful garden dots per request.

  ctx.save();
  const vignette = ctx.createRadialGradient(
    BASE_WIDTH / 2,
    BASE_HEIGHT / 2,
    BASE_HEIGHT * 0.1,
    BASE_WIDTH / 2,
    BASE_HEIGHT / 2,
    BASE_HEIGHT * 0.85
  );
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, theme.vignette || "rgba(0,0,0,0.45)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, BASE_WIDTH, BASE_HEIGHT);
  ctx.restore();
}

function drawGrid() {
  // Grid removed per request.
}

function drawPath() {
  const theme = getTheme();
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 14;
  ctx.strokeStyle = theme.pathOuter || "#9e7546";
  ctx.lineWidth = TILE * 0.86;
  ctx.beginPath();
  pathPoints.forEach((pt, index) => {
    if (index === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = theme.pathInner || "#c79b63";
  ctx.lineWidth = TILE * 0.62;
  ctx.beginPath();
  pathPoints.forEach((pt, index) => {
    if (index === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = theme.pathDash || "rgba(70, 45, 20, 0.35)";
  ctx.lineWidth = 2;
  ctx.setLineDash([14, 12]);
  ctx.beginPath();
  pathPoints.forEach((pt, index) => {
    if (index === 0) ctx.moveTo(pt.x, pt.y);
    else ctx.lineTo(pt.x, pt.y);
  });
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = theme.stone || "rgba(255, 255, 255, 0.35)";
  pathDecor.forEach((stone) => {
    ctx.beginPath();
    ctx.arc(stone.x, stone.y, stone.r, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawTowers() {
  towers.forEach((tower) => {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.45)";
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
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 10;
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
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.beginPath();
    ctx.ellipse(enemy.pos.x, enemy.pos.y + 10, enemy.type.size * 0.5, enemy.type.size * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    if (img) {
      ctx.shadowColor = "rgba(0,0,0,0.35)";
      ctx.shadowBlur = 8;
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
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(proj.x, proj.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
}

function drawClovers() {
  clovers.forEach((clover) => {
    const size = Math.max(6, Math.min(12, clover.tower.stats.cloverRadius * 0.3));
    ctx.save();
    ctx.fillStyle = "#5ad66a";
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(clover.x - size * 0.4, clover.y - size * 0.4, size * 0.45, 0, Math.PI * 2);
    ctx.arc(clover.x + size * 0.4, clover.y - size * 0.4, size * 0.45, 0, Math.PI * 2);
    ctx.arc(clover.x - size * 0.4, clover.y + size * 0.4, size * 0.45, 0, Math.PI * 2);
    ctx.arc(clover.x + size * 0.4, clover.y + size * 0.4, size * 0.45, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#2f7d32";
    ctx.fillRect(clover.x - 1.2, clover.y + size * 0.35, 2.4, size * 0.9);
    ctx.restore();
  });
}

function drawDuckDrops() {
  duckDrops.forEach((drop) => {
    const alpha = Math.max(0, drop.life / drop.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.beginPath();
    ctx.ellipse(drop.x, drop.y + 6, 10, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffd166";
    ctx.beginPath();
    ctx.arc(drop.x, drop.y, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ff9f1c";
    ctx.beginPath();
    ctx.moveTo(drop.x + 6, drop.y + 1);
    ctx.lineTo(drop.x + 11, drop.y + 3);
    ctx.lineTo(drop.x + 6, drop.y + 5);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#2b1d0f";
    ctx.beginPath();
    ctx.arc(drop.x - 2, drop.y - 3, 1.4, 0, Math.PI * 2);
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
  if (!hover.active) return;
  if (hover.tower) {
    ctx.save();
    ctx.globalAlpha = 0.25;
    ctx.strokeStyle = "#48e0c5";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(hover.tower.x, hover.tower.y, hover.tower.stats.range, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    return;
  }
  const tower = TOWER_TYPES[state.selectedTowerId];
  if (!tower) return;
  const center = { x: hover.x, y: hover.y };
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
  ctx.fillStyle = hover.valid ? "rgba(72, 224, 197, 0.18)" : "rgba(255, 95, 86, 0.18)";
  ctx.beginPath();
  ctx.arc(center.x, center.y, TOWER_RADIUS, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawDebug() {
  if (!state.debug || !state.debug.showHitboxes) return;
  ctx.save();
  ctx.strokeStyle = "rgba(255, 120, 90, 0.4)";
  ctx.lineWidth = 1.5;
  pathTiles.forEach((tile) => {
    ctx.strokeRect(tile.c * TILE, tile.r * TILE, TILE, TILE);
  });

  ctx.strokeStyle = "rgba(72, 224, 197, 0.35)";
  towers.forEach((tower) => {
    ctx.beginPath();
    ctx.arc(tower.x, tower.y, TOWER_RADIUS, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
  enemies.forEach((enemy) => {
    ctx.beginPath();
    ctx.arc(enemy.pos.x, enemy.pos.y, enemy.type.size * 0.5, 0, Math.PI * 2);
    ctx.stroke();
  });
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
  // drawGrid removed per request.
  drawClovers();
  drawHover();
  drawTowers();
  drawProjectiles();
  drawDuckDrops();
  drawEnemies();
  drawDebug();
  drawFloaters();

  ctx.restore();
}

function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = Math.min((timestamp - lastTime) / 1000, MAX_FRAME_DT);
  lastTime = timestamp;
  update(delta * state.speed);
  render();
  syncUI();
  requestAnimationFrame(loop);
}

function syncUI() {
  moneyEl.textContent = state.debug && state.debug.infMoney ? "∞" : `$${state.money}`;
  livesEl.textContent = state.lives;
  const waveNumber = state.waveIndex + 1;
  const wave = getWave(state.waveIndex);
  if (state.waveIndex < WAVES.length) {
    waveEl.textContent = `${waveNumber} / ${WAVES.length}`;
    waveCountEl.textContent = `${waveNumber} / ${WAVES.length}`;
    waveNameEl.textContent = `Wave ${waveNumber}`;
  } else if (!state.freeplay) {
    waveEl.textContent = `${WAVES.length} / ${WAVES.length}`;
    waveCountEl.textContent = `${WAVES.length} / ${WAVES.length}`;
    waveNameEl.textContent = "Campaign Complete";
  } else {
    const freeplayIndex = state.waveIndex - WAVES.length + 1;
    waveEl.textContent = `Freeplay ${freeplayIndex}`;
    waveCountEl.textContent = `Freeplay ${freeplayIndex}`;
    waveNameEl.textContent = `Freeplay ${freeplayIndex}`;
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

  const controlsLocked = !state.started || state.gameOver;
  startWaveBtn.disabled = controlsLocked || state.inWave;
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
  toggleSpeedBtn.disabled = !state.started;
  togglePauseBtn.disabled = !state.started;
  toggleAutostartBtn.disabled = !state.started;
  if (!state.started) {
    togglePauseBtn.textContent = "Pause";
  }

  const selected = TOWER_TYPES[state.selectedTowerId];
  if (selected) {
    selectedImageEl.src = ASSETS[selected.id];
    selectedNameEl.textContent = selected.name;
    selectedDescEl.textContent = selected.description;
    selectedCostEl.textContent = `$${selected.cost}`;
    const baseStats = getBaseStats(selected);
    const damageDisplay = baseStats.damage > 0 ? baseStats.damage : baseStats.cloverDamage;
    selectedDamageEl.textContent = `${damageDisplay}`;
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
    sellTowerBtn.disabled = true;
    sellTowerBtn.textContent = "Sell Tower";
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
    sellTowerBtn.disabled = false;
    sellTowerBtn.textContent = `Sell ($${getTowerSellValue(placed)})`;

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
        button.disabled = !canAfford(cost) || state.gameOver;
      }
    });
  }

  if (debugPanelEl) {
    debugPanelEl.hidden = !state.debug.unlocked;
    if (state.debug.unlocked) {
      debugInfMoneyBtn.textContent = state.debug.infMoney ? "Infinite Money: On" : "Infinite Money: Off";
      debugHitboxesBtn.textContent = state.debug.showHitboxes ? "Hitboxes: On" : "Hitboxes: Off";
    }
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

function isInsideBounds(x, y, radius = TOWER_RADIUS) {
  return x >= radius && x <= BASE_WIDTH - radius && y >= radius && y <= BASE_HEIGHT - radius;
}

function circleIntersectsRect(cx, cy, radius, rx, ry, rw, rh) {
  const closestX = Math.max(rx, Math.min(cx, rx + rw));
  const closestY = Math.max(ry, Math.min(cy, ry + rh));
  const dx = cx - closestX;
  const dy = cy - closestY;
  return dx * dx + dy * dy <= radius * radius;
}

function isOnPath(x, y, radius = TOWER_RADIUS) {
  for (const tile of pathTiles) {
    const rx = tile.c * TILE;
    const ry = tile.r * TILE;
    if (circleIntersectsRect(x, y, radius, rx, ry, TILE, TILE)) return true;
  }
  return false;
}

function isOverlappingTower(x, y, radius = TOWER_RADIUS) {
  for (const tower of towers) {
    const dx = x - tower.x;
    const dy = y - tower.y;
    const minDist = radius + TOWER_RADIUS - 2;
    if (dx * dx + dy * dy <= minDist * minDist) return true;
  }
  return false;
}

function canPlaceAt(x, y) {
  if (!isInsideBounds(x, y)) return false;
  if (isOnPath(x, y)) return false;
  if (isOverlappingTower(x, y)) return false;
  return true;
}

function getTowerAtPoint(x, y) {
  for (const tower of towers) {
    const dx = x - tower.x;
    const dy = y - tower.y;
    if (dx * dx + dy * dy <= TOWER_RADIUS * TOWER_RADIUS) return tower;
  }
  return null;
}

function getDuckDropAtPoint(x, y) {
  for (const drop of duckDrops) {
    const dx = x - drop.x;
    const dy = y - drop.y;
    if (dx * dx + dy * dy <= DUCK_DROP_RADIUS * DUCK_DROP_RADIUS) return drop;
  }
  return null;
}

function handleCanvasMove(event) {
  const coords = toGameCoords(event.clientX, event.clientY);
  hover.active = true;
  hover.x = coords.x;
  hover.y = coords.y;
  hover.tower = getTowerAtPoint(coords.x, coords.y);
  if (hover.tower) {
    hover.valid = false;
  } else {
    hover.valid = canPlaceAt(coords.x, coords.y);
  }
}

function handleCanvasLeave() {
  hover.active = false;
  hover.tower = null;
}

function handleCanvasClick(event) {
  if (!state.started) return;
  if (state.gameOver) return;
  const coords = toGameCoords(event.clientX, event.clientY);
  const drop = getDuckDropAtPoint(coords.x, coords.y);
  if (drop) {
    state.money += drop.value;
    duckDrops = duckDrops.filter((item) => item !== drop);
    floaters.push({ x: drop.x, y: drop.y - 10, text: `+$${drop.value}`, color: "#48e0c5", life: 0.9 });
    syncUI();
    return;
  }
  const existingTower = getTowerAtPoint(coords.x, coords.y);
  if (existingTower) {
    selectPlacedTower(existingTower);
    syncUI();
    return;
  }
  const towerType = TOWER_TYPES[state.selectedTowerId];
  if (!towerType) return;
  if (!canPlaceAt(coords.x, coords.y)) {
    hintEl.textContent = "That spot is blocked. Try another place.";
    return;
  }
  if (!canAfford(towerType.cost)) {
    hintEl.textContent = "Not enough credits for that tower.";
    return;
  }
  const newTower = new Tower(towerType, coords.x, coords.y);
  towers.push(newTower);
  selectPlacedTower(newTower);
  spend(towerType.cost);
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

  sellTowerBtn.addEventListener("click", () => {
    sellSelectedTower();
  });

  if (debugAddMoneyBtn) {
    debugAddMoneyBtn.addEventListener("click", () => {
      state.money += 1000;
      floaters.push({ x: BASE_WIDTH / 2, y: 40, text: "+$1000", color: "#48e0c5", life: 1.0 });
      syncUI();
    });
  }

  if (debugInfMoneyBtn) {
    debugInfMoneyBtn.addEventListener("click", () => {
      state.debug.infMoney = !state.debug.infMoney;
      syncUI();
    });
  }

  if (debugHitboxesBtn) {
    debugHitboxesBtn.addEventListener("click", () => {
      state.debug.showHitboxes = !state.debug.showHitboxes;
      syncUI();
    });
  }

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
  window.addEventListener("blur", () => {
    if (!state.started || state.gameOver) return;
    if (!state.paused) {
      state.paused = true;
      hintEl.textContent = "Auto-paused (window inactive).";
      syncUI();
    }
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && state.started && !state.gameOver) {
      if (!state.paused) {
        state.paused = true;
        hintEl.textContent = "Auto-paused (tab inactive).";
        syncUI();
      }
    }
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      state.paused = !state.paused;
      syncUI();
    }
    if (!event.ctrlKey && !event.metaKey && !event.altKey) {
      handleDebugSequence(event.key);
    }
  });
}

function init() {
  resize();
  bindUI();
  syncUI();
  requestAnimationFrame(loop);
}

function beginGame() {
  if (gameLoading || gameLoaded) return;
  applyMap(selectedMapId || MAPS[0].id);
  gameLoading = true;
  if (startGameBtn) {
    startGameBtn.disabled = true;
    startGameBtn.textContent = "Loading...";
  }
  loadImages().then(() => {
    state.started = true;
    state.paused = false;
    init();
    gameLoading = false;
    gameLoaded = true;
    if (titleOverlayEl) titleOverlayEl.classList.remove("active");
    document.body.classList.remove("title-active");
    if (mapOverlayEl) mapOverlayEl.classList.remove("active");
    document.body.classList.remove("map-select-active");
    if (startGameBtn) {
      startGameBtn.disabled = false;
      startGameBtn.textContent = "Start Game";
    }
    hintEl.textContent = "Click a tower, then click a tile to deploy.";
    syncUI();
  });
}

if (startGameBtn) {
  startGameBtn.addEventListener("click", () => {
    if (titleOverlayEl) titleOverlayEl.classList.remove("active");
    document.body.classList.remove("title-active");
    if (mapOverlayEl) mapOverlayEl.classList.add("active");
    document.body.classList.add("map-select-active");
  });
}

if (backToTitleBtn) {
  backToTitleBtn.addEventListener("click", () => {
    if (mapOverlayEl) mapOverlayEl.classList.remove("active");
    document.body.classList.remove("map-select-active");
    if (titleOverlayEl) titleOverlayEl.classList.add("active");
    document.body.classList.add("title-active");
  });
}

if (mapOptionEls.length) {
  mapOptionEls.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mapId = btn.dataset.map;
      if (mapId) {
        selectedMapId = mapId;
        applyMap(mapId);
      }
      beginGame();
    });
  });
}
