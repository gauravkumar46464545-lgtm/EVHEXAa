// Indicative sample data. Prices and specs change often: confirm with the manufacturer before publishing.
export const VEHICLES = [
 {
  "id": "tiago",
  "brand": "Tata",
  "model": "Tiago EV",
  "price": 7.99,
  "range": 315,
  "speed": 120,
  "battery": "24 kWh",
  "body": "Hatchback",
  "img": 1
 },
 {
  "id": "punch",
  "brand": "Tata",
  "model": "Punch EV",
  "price": 9.99,
  "range": 421,
  "speed": 140,
  "battery": "35 kWh",
  "body": "SUV",
  "img": 2
 },
 {
  "id": "comet",
  "brand": "MG",
  "model": "Comet EV",
  "price": 6.99,
  "range": 230,
  "speed": 100,
  "battery": "17.3 kWh",
  "body": "Hatchback",
  "img": 3
 },
 {
  "id": "nexon",
  "brand": "Tata",
  "model": "Nexon EV",
  "price": 12.49,
  "range": 489,
  "speed": 150,
  "battery": "45 kWh",
  "body": "SUV",
  "img": 4
 },
 {
  "id": "windsor",
  "brand": "MG",
  "model": "Windsor EV",
  "price": 13.99,
  "range": 332,
  "speed": 135,
  "battery": "38 kWh",
  "body": "Crossover",
  "img": 5
 },
 {
  "id": "xuv400",
  "brand": "Mahindra",
  "model": "XUV400",
  "price": 15.49,
  "range": 456,
  "speed": 150,
  "battery": "39.4 kWh",
  "body": "SUV",
  "img": 1
 },
 {
  "id": "creta",
  "brand": "Hyundai",
  "model": "Creta Electric",
  "price": 17.99,
  "range": 473,
  "speed": 160,
  "battery": "51.4 kWh",
  "body": "SUV",
  "img": 2
 },
 {
  "id": "atto3",
  "brand": "BYD",
  "model": "Atto 3",
  "price": 24.99,
  "range": 521,
  "speed": 160,
  "battery": "60.5 kWh",
  "body": "SUV",
  "img": 3
 }
];
export const BUDGETS = [["any", "Any budget"], ["under10", "Under ₹10 Lakh"], ["10-15", "₹10 – 15 Lakh"], ["15-20", "₹15 – 20 Lakh"], ["20plus", "Above ₹20 Lakh"]];
export const RANGES = [["any", "Any range"], ["250", "250+ km"], ["350", "350+ km"], ["450", "450+ km"]];
export const byId = (id) => VEHICLES.find((v) => v.id === id);
export const priceText = (p) => `₹ ${p.toFixed(2)} Lakh*`;
export const inBudget = (p, k) => k === "any" || (k === "under10" ? p < 10 : k === "10-15" ? p >= 10 && p < 15 : k === "15-20" ? p >= 15 && p < 20 : p >= 20);
export const PAIRS = [
  ["nexon", "xuv400"],
  ["punch", "windsor"],
  ["tiago", "comet"],
  ["creta", "atto3"],
  ["nexon", "creta"],
];