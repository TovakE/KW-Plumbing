# KW Plumbing Pricebook

A dependency-free, browser-based flat-rate pricing and quote system for KW Plumbing.

## Features

- Editable service, material, labor, and excavation catalog
- Wisconsin-oriented tax treatment prompts
- Customer quote builder with discounts, tax, deposits, and printable estimates
- Job profit calculator with overhead, contingency, suggested price, and margin checks
- Company branding and pricing defaults
- Automatic browser storage plus JSON backup/import
- Responsive layout that works on desktop, tablet, and mobile

## Run locally

Open `index.html` in a modern browser. For the most reliable local behavior, serve the folder with any static web server:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Data and privacy

All company data and quotes are stored in the current browser using `localStorage`. Nothing is transmitted to a server. Export a JSON backup regularly, especially before clearing browser data or changing devices.

## Wisconsin sales tax

The sample catalog distinguishes original installation from replacement/repair where relevant. Wisconsin generally treats an original bathroom-fixture installation as a real-property improvement, while repair or replacement of bathroom fixtures is generally taxable to the customer. Facts can vary; review Wisconsin Department of Revenue Publication 207 and obtain professional advice for unusual jobs.

## Deployment

This project is static and can be hosted directly with GitHub Pages, Cloudflare Pages, Netlify, or Vercel.
