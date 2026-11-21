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
  "img": 1,
  "photo": "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=800&q=80"
 },
 {
  "id": "punch",
  "brand": "Tata",
  "model": "Punch EV",
  "price": 9.99,
  "range": 421,
  "speed": 140,
  "battery": "35 kWh",
  "body": "Compact SUV",
  "img": 2,
  "photo": "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80"
 },
 {
  "id": "comet",
  "brand": "MG",
  "model": "Comet EV",
  "price": 6.99,
  "range": 230,
  "speed": 100,
  "battery": "17.3 kWh",
  "body": "City Hatchback",
  "img": 3,
  "photo": "https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=800&q=80"
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
  "img": 4,
  "photo": "https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80"
 },
 {
  "id": "windsor",
  "brand": "MG",
  "model": "Windsor EV",
  "price": 13.99,
  "range": 332,
  "speed": 135,
  "battery": "38 kWh",
  "body": "Crossover SUV",
  "img": 5,
  "photo": "https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80"
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
  "img": 1,
  "photo": "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=800&q=80"
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
  "img": 2,
  "photo": "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
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
  "img": 3,
  "photo": "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80"
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