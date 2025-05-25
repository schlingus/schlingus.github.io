let schlingus = document.querySelector(".schlingus-cost");
let parsedSchlingus = parseFloat(schlingus.innerHTML);

let luisCost = document.querySelector(".luis-cost");
let parsedLuisCost = parseFloat(luisCost.innerHTML);
let luisLevel = document.querySelector(".luis-level");
let luisIncrease = document.querySelector(".luis-increase");
let parsedLuisIncrease = parseFloat(luisIncrease.innerHTML);

let redcliffCost = document.querySelector(".redcliff-cost");
let parsedRedcliffCost = parseFloat(redcliffCost.innerHTML);
let redcliffLevel = document.querySelector(".redcliff-level");
let redcliffIncrease = document.querySelector(".redcliff-increase");
let parsedRedcliffIncrease = parseFloat(redcliffIncrease.innerHTML);

let mistrakeCost = document.querySelector(".mistrake-cost");
let parsedMistrakeCost = parseFloat(mistrakeCost.innerHTML);
let mistrakeLevel = document.querySelector(".mistrake-level");
let mistrakeIncrease = document.querySelector(".mistrake-increase");
let parsedMistrakeIncrease = parseFloat(mistrakeIncrease.innerHTML);

let spcText = document.getElementById("spc-text");
let spsText = document.getElementById("sps-text");

let schlingusImgContainer = document.querySelector(".schlingus-img-container");

let spc = 1;

let sps = 0;

const upgrades = [
  {
    name: 'luis',
    cost: document.querySelector(".luis-cost"),
    parsedCost: parseFloat(document.querySelector(".luis-cost").innerHTML),
    increase: document.querySelector(".luis-increase"),
    parsedIncrease: parseFloat(document.querySelector(".luis-increase").innerHTML),
    level: document.querySelector(".luis-level"),
    schlingusMultiplier: 1.03,
    costMultiplier: 1.18,
  },
  {
    name: 'redcliff',
    cost: document.querySelector(".redcliff-cost"),
    parsedCost: parseFloat(document.querySelector(".redcliff-cost").innerHTML),
    increase: document.querySelector(".redcliff-increase"),
    parsedIncrease: parseFloat(document.querySelector(".redcliff-increase").innerHTML),
    level: document.querySelector(".redcliff-level"),
    schlingusMultiplier: 1.03,
    costMultiplier: 1.18,
  },
  {
    name: 'mistrake',
    cost: document.querySelector(".mistrake-cost"),
    parsedCost: parseFloat(document.querySelector(".mistrake-cost").innerHTML),
    increase: document.querySelector(".mistrake-increase"),
    parsedIncrease: parseFloat(document.querySelector(".mistrake-increase").innerHTML),
    level: document.querySelector(".mistrake-level"),
    schlingusMultiplier: 1.03,
    costMultiplier: 1.18,
  },
  {
    name: 'bungile',
    cost: document.querySelector(".bungile-cost"),
    parsedCost: parseFloat(document.querySelector(".bungile-cost").innerHTML),
    increase: document.querySelector(".bungile-increase"),
    parsedIncrease: parseFloat(document.querySelector(".bungile-increase").innerHTML),
    level: document.querySelector(".bungile-level"),
    schlingusMultiplier: 1.03,
    costMultiplier: 1.18,
  },
];

console.log(upgrades[0].name);

function incrementSchlingus(event) {
  schlingus.innerHTML = Math.round(parsedSchlingus +=spc);

  const x = event.offsetX
  const y = event.offsetY

  const div = document.createElement("div")
  div.innerHTML = `+${Math.round(spc)}`
  div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;`
  schlingusImgContainer.appendChild(div)

  div.classList.add('fade-up')

timeout(div);
}

const timeout = (div) => {
  setTimeout(() => {
    div.remove()
  }, 800)
}

function buyUpgrade(upgrade) {

  const mu = upgrades.find((u) => {
    if (u.name === upgrade) return u
  })
  
  if (parsedSchlingus >= mu.parsedCost) {
    schlingus.innerHTML = Math.round(parsedSchlingus -= mu.parsedCost);

    mu.level.innerHTML ++

    mu.parsedIncrease = parseFloat((mu.parsedIncrease * mu.schlingusMultiplier).toFixed(2));
    mu.increase.innerHTML = mu.parsedIncrease;
    spc += mu.parsedIncrease
    mu.parsedCost *= mu.costMultiplier;
    mu.cost.innerHTML = Math.round(mu.parsedCost);

    if (mu.name === 'luis') {
      spc +- mu.parsedIncrease;
   } else {
    sps += mu.parsedIncrease;
   }
  }
}

   setInterval(() => {
parsedSchlingus += sps / 100
schlingus.innerHTML = Math.round(parsedSchlingus);
spcText.innerHTML = Math.round(spc)
spsText.innerHTML = Math.round(sps);
   },10)

   