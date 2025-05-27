import { upgrades } from "./constants/upgrades.js";
import { defaultValues } from "./constants/defaultValues.js";

let schlingus = document.querySelector(".schlingus-cost");
let parsedSchlingus = parseFloat(schlingus.innerHTML);
schlingus.innerHTML = Math.round(parsedSchlingus);


let spcText = document.getElementById("spc-text");
let spsText = document.getElementById("sps-text");

let schlingusImgContainer = document.querySelector(".schlingus-img-container");

let spc = 1;
let sps = 0;


function createUpgrades() {
  const upgradesContainer = document.getElementById('upgrades-container');
  const template = document.getElementById('upgrade-template').textContent;

  // Use upgrades as the default values if defaultValues is not defined elsewhere
  const defaultValues = upgrades;

  defaultValues.forEach((value) => {
    let html = template;

    // Replace all placeholders in the template with corresponding values from the upgrade object
    html = html.replace(/{{(.*?)}}/g, (match, key) => {
      // If the key exists in the value object, replace it; otherwise, use an empty string
      return value[key.trim()] !== undefined ? value[key.trim()] : '';
    });

    upgradesContainer.innerHTML += html;
  });
}

createUpgrades();

function incrementSchlingus(event) {
  // Always parse the current value from the DOM to keep in sync
  parsedSchlingus = parseFloat(schlingus.innerHTML);
  parsedSchlingus += spc;
  schlingus.innerHTML = Math.round(parsedSchlingus);

  const x = event.offsetX;
  const y = event.offsetY;

  const div = document.createElement("div");
  div.innerHTML = `+${Math.round(spc)}`;
  div.style.cssText = `color: white; position: absolute; top: ${y}px; left: ${x}px; font-size: 15px; pointer-events: none;`;
  schlingusImgContainer.appendChild(div);

  div.classList.add('fade-up');

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

function save() {
localStorage.clear();

upgrades.map((upgrade) => {
 
const obj = JSON.stringify({
  parsedLevel: parseFloat(upgrade.level.innerHTML),
  parsedCost: upgrade.parsedCost,
  parsedIncrease: upgrade.parsedIncrease,
})

localStorage.setItem(upgrade.name, obj);
})

localStorage.setItem('spc', JSON.stringify(spc));
localStorage.setItem('sps', JSON.stringify(sps));
localStorage.setItem('schlingus', JSON.stringify(parsedSchlingus));

}

function load() {
upgrades.map((upgrade) => {
  const savedvalues = JSON.parse(localStorage.getItem(upgrade.name));

  upgrade.parsedCost = savedvalues.parsedCost;
  upgrade.parsedIncrease = savedvalues.parsedIncrease;
  upgrade.level.innerHTML = savedvalues.parsedLevel;
  upgrade.cost.innerHTML = Math.round(upgrade.parsedCost);
  upgrade.increase.innerHTML = upgrade.parsedIncrease;
});

spc = JSON.parse(localStorage.getItem('spc'))
sps = JSON.parse(localStorage.getItem('sps'))
parsedSchlingus = JSON.parse(localStorage.getItem('schlingus'));

schlingus.innerHTML = Math.round(parsedSchlingus);

}
   setInterval(() => {
parsedSchlingus += sps / 100
schlingus.innerHTML = Math.round(parsedSchlingus);
spcText.innerHTML = Math.round(spc)
spsText.innerHTML = Math.round(sps);
   },10)
  
  window.incrementSchlingus = incrementSchlingus;
  window.buyUpgrade = buyUpgrade;
  window.save = save;
  window.load = load;
