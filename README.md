# KrishiMitra (farmguard)

a simple farming helper you can chat with. made for farmers in india.

## what it can do

- **plant problems** - you tell it what you see on the plant (white powder, holes in fruit, sticky leaves...) and it matches that with 15 common diseases and pests. gives treatment and how to stop it next time.
- **soil report** - upload your Soil Health Card PDF (or type the values like `pH 6.8, N 240, P 18, K 150`). it reads the numbers, says what is low or high and what to do.
- **weather** - ask "weather in thrissur". real 5 day forecast from open-meteo + tips like "rain tomorrow, dont spray today".
- **mandi prices** - ask "price of onion in maharashtra". live prices from data.gov.in if you add a key (see below), else it shows rough reference prices and says clearly they are not live.
- **crop advice** - asks month, water and soil type, then suggests crops.

## what it can NOT do (yet)

- it can't find diseases from a photo. an older version said it could but it was just picking a random disease, which is dangerous for a farmer (wrong medicine). now it asks what you see instead. a real photo model is on the todo list.
- scanned soil cards (just a photo in a pdf) can't be read, you have to type the values.
- it is not a replacement for your local KVK or agriculture officer. every diagnosis tells you to confirm before using chemicals.

## run it

```
npm install
npm run dev
```

open http://localhost:3000

## live mandi prices (optional)

1. make a free account on data.gov.in and copy your API key
2. make a file `.env.local` with:

```
DATA_GOV_KEY=your key here
```

note: i could not test the live price api from my laptop (data.gov.in was not reachable), so check it once with your key.

## tests

```
npm test
```

tests are in `src/lib/*.test.ts` and run with node's own test runner (node 23+).

## how its made

- next.js + react + tailwind
- `src/lib/reply.ts` - decides what the bot says
- `src/lib/symptoms.ts` - symptom checker
- `src/lib/soil.ts` - reads soil values and gives advice (normal soil health card limits)
- `src/lib/weather.ts` - open-meteo forecast + farm tips
- `src/lib/prices.ts` + `src/app/api/prices` - mandi prices
- `src/app/api/soil` - reads text out of the pdf

## todo

- photo diagnosis with a real trained model (like a plantvillage model)
- malayalam / hindi / tamil
- voice input for people who cant type easily
