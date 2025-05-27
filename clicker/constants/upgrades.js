import { defaultValues } from "./defaultValues.js";

function createUpgrades() {
  const upgradesContainer = document.getElementById('upgrades-container');
  const template = document.getElementById('upgrade-template').textContent;

  defaultValues.forEach((value) => {
    let html = template

  Object.keys(value).forEach((key) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value[key]);
  });
    
  upgradesContainer.innerHTML += html
  })
}

createUpgrades();

export const upgrades = [
    {
        name: 'luisgamercool23',
        get cost() { return document.querySelector('.luisgamercool23-cost'); },
        get parsedCost() { return parseFloat(document.querySelector('.luisgamercool23-cost').innerHTML); },
        get increase() { return document.querySelector('.luisgamercool23-increase'); },
        get parsedIncrease() { return parseFloat(document.querySelector('.luisgamercool23-increase').innerHTML); },
        get level() { return document.querySelector('.luisgamercool23-level'); },
        schlingusMultiplier: 1.1,
        costMultiplier: 1.2,
    },
    {
        name: 'redcliff',
        get cost() { return document.querySelector('.redcliff-cost'); },
        get parsedCost() { return parseFloat(document.querySelector('.redcliff-cost').innerHTML); },
        get increase() { return document.querySelector('.redcliff-increase'); },
        get parsedIncrease() { return parseFloat(document.querySelector('.redcliff-increase').innerHTML); },
        get level() { return document.querySelector('.redcliff-level'); },
        schlingusMultiplier: 1.1,
        costMultiplier: 1.2,
    },
    {
        name: 'mistrake',
        get cost() { return document.querySelector('.mistrake-cost'); },
        get parsedCost() { return parseFloat(document.querySelector('.mistrake-cost').innerHTML); },
        get increase() { return document.querySelector('.mistrake-increase'); },
        get parsedIncrease() { return parseFloat(document.querySelector('.mistrake-increase').innerHTML); },
        get level() { return document.querySelector('.mistrake-level'); },
        schlingusMultiplier: 1.1,
        costMultiplier: 1.2,
    },
    {
        name: 'bungile',
        get cost() { return document.querySelector('.bungile-cost'); },
        get parsedCost() { return parseFloat(document.querySelector('.bungile-cost').innerHTML); },
        get increase() { return document.querySelector('.bungile-increase'); },
        get parsedIncrease() { return parseFloat(document.querySelector('.bungile-increase').innerHTML); },
        get level() { return document.querySelector('.bungile-level'); },
        schlingusMultiplier: 1.1,
        costMultiplier: 1.2,
    },
    {
        name: 'infernus',
        get cost() { return document.querySelector('.infernus-cost'); },
        get parsedCost() { return parseFloat(document.querySelector('.infernus-cost').innerHTML); },
        get increase() { return document.querySelector('.infernus-increase'); },
        get parsedIncrease() { return parseFloat(document.querySelector('.infernus-increase').innerHTML); },
        get level() { return document.querySelector('.infernus-level'); },
        schlingusMultiplier: 2,
        costMultiplier: 3.5,
    },
];