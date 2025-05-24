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

let spc = 1;

let sps = 0;

function incrementSchlingus() {
  schlingus.innerHTML = Math.round(parsedSchlingus +=spc);
}

function buyLuis() {
  if (parsedSchlingus >= parsedLuisCost) {
    schlingus.innerHTML = Math.round(parsedSchlingus -= parsedLuisCost)
    
    luisLevel.innerHTML = (parseInt(luisLevel.innerHTML)) + 1;

    parsedLuisIncrease = parseFloat((parsedLuisIncrease * 1.03).toFixed(2));
    luisIncrease.innerHTML = parsedLuisIncrease;
    spc += parsedLuisIncrease;

    parsedLuisCost *= 1.18;
    luisCost.innerHTML = Math.round(parsedLuisCost);
   }
 }

 function buyRedcliff() {
    if (parsedSchlingus >= parsedRedcliffCost) {
      schlingus.innerHTML = Math.round(parsedSchlingus -= parsedRedcliffCost)
      
      redcliffLevel.innerHTML = (parseInt(redcliffLevel.innerHTML)) + 1;
  
      parsedRedcliffIncrease = parseFloat((parsedRedcliffIncrease * 1.03).toFixed(2));
      redcliffIncrease.innerHTML = parsedRedcliffIncrease;
      spc += parsedRedcliffIncrease;
  
      parsedRedcliffCost *= 1.18;
      redcliffCost.innerHTML = Math.round(parsedRedcliffCost);
     }
   }

   function buyMistrake() {
    if (parsedSchlingus >= parsedMistrakeCost) {
      schlingus.innerHTML = Math.round(parsedSchlingus -= parsedMistrakeCost)
      
      mistrakeLevel.innerHTML = (parseInt(mistrakeLevel.innerHTML)) + 1;
  parsedMistrakeIncrease = Math.floor(Math.random() * (500 - 50 + 1)) + 50;
      parsedMistrakeIncrease = parseFloat((parsedMistrakeIncrease * 1.03).toFixed(2));
      mistrakeIncrease.innerHTML = parsedMistrakeIncrease;
      sps += parsedMistrakeIncrease;
  
      parsedMistrakeCost *= 1.18;
      mistrakeCost.innerHTML = Math.round(parsedMistrakeCost);
     }
   }

   setInterval(() => {
parsedSchlingus += sps / 100
schlingus.innerHTML = Math.round(parsedSchlingus);
spcText.innerHTML = Math.round(spc)
spsText.innerHTML = Math.round(sps);
   },10)