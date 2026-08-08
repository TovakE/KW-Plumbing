# KW Plumbing Pricebook

A lightweight, dependency-free internal pricing, quote, and invoice system for KW Plumbing in the Appleton and Fox Cities area.

## Features

- Simple three-step quote flow with optional details hidden until needed
- Editable labor rates and service charges with search, duplicate, and archive actions
- Residential common-services pricebook with scope, labor-hour, and tax defaults
- Field-friendly quotes using one total parts cost, automatic material markup, and selectable labor codes
- Initial-visit credit workflow for approved repairs
- Wisconsin-oriented tax treatment prompts
- Customer quote builder with discounts, tax, deposits, approval fields, and printable estimates
- Invoice builder with editable lines, statuses, partial payments, balances, duplication, and printable output
- Customer records, company branding, payment terms, warranty language, and pricing defaults
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

## Pricing and Wisconsin sales tax

Quotes use a single parts-cost input rather than individual part lines. The app calculates the customer parts price from the editable material markup, then combines it with selected labor codes and quantities. Wisconsin tax treatment varies with the work performed, so parts and each labor line have editable tax controls. Review Wisconsin Department of Revenue Publication 207 and obtain professional advice for unusual jobs.

## Deployment

This project is static and can be hosted directly with GitHub Pages, Cloudflare Pages, Netlify, or Vercel.
