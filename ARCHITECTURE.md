# K1 Outdoors — Landing Page System Architecture

This covers the reusable system built for K1's industry landing pages, using
`/festival-tent-rentals` as the first complete example. Read this before
cloning a new industry page.

## 1. What this is (and isn't)

- **Is:** a lead-generation funnel. Traffic → industry landing page → smart
  lead form → K1 follows up → custom quote → booking through K1's existing
  rental system.
- **Isn't:** ecommerce. No cart, no checkout, no prominent per-unit pricing.
  The primary conversion event is a completed lead form, not a purchase.

A previous version of this repo (`/index.html`) was built as a consumer
e-commerce page — fixed package pricing, an urgency countdown, "Buy Now"
style CTAs — for a different, invented product. That page does not reflect
K1's actual business model (event rental lead-gen for the K1 Summit
Shelter) and should be treated as superseded, not extended. **Decision
needed from K1:** replace `/index.html` with a general K1 homepage using
this system, or leave it and only build out the `/industry-name/` pages —
flagged below.

## 2. File structure

```
/design-system.css         Shared tokens + components (header, hero, cards,
                            steps, gallery, FAQ, lead form, footer, sticky CTA)
/components/site.js        Shared nav toggle + year stamp
/components/lead-form.js   Shared lead form logic (UTM capture, submit, success state)
/festival-tent-rentals/    First complete example page
/assets/                   Real K1 product photography
/ARCHITECTURE.md           This file
```

Every new industry page is a new folder (`/wedding-tent-rentals/index.html`,
`/corporate-retreats/index.html`, etc.) that:

1. Links the same `../design-system.css`, `../components/site.js`,
   `../components/lead-form.js`.
2. Reuses the same section order (hero → problem → solution → use cases →
   how it works → what's included → why K1 → gallery → example package →
   FAQ → final CTA + lead form).
3. Changes only the **content** — headline, problem framing, use cases,
   FAQ, testimonials, and the hidden `industry` / `landingPage` /
   `eventType` default in the lead form.
4. Does **not** introduce new components. If a new industry genuinely needs
   a new UI pattern, add it to `design-system.css` as a shared class, not
   as one-off CSS in the page.

This is the "master template → industry content" structure requested in the
brief — there's no build step or templating engine involved (plain HTML/CSS/
JS, consistent with the rest of this repo), so "cloning" means copying
`festival-tent-rentals/index.html` into a new folder and rewriting the
copy section by section, following the same STEP 1–13 workflow (audience →
problem → decision-maker → objections → value prop → architecture → copy →
missing-info flags → build → review as customer → review as CRO → review on
mobile → cut anything unnecessary) before publishing.

## 3. The lead form

One form, reused everywhere: `<form data-k1-lead-form>`. Fields:

- Event type (pill radio group, defaults to the page's industry)
- Event date
- Event location
- Approximate shelter quantity (pill radio group: 1 / 2–5 / 6–10 / 11–20 / 20+)
- Intended use (free text)
- Name, phone, email
- Hidden: `industry`, `landingPage`, `campaign`, all five `utm_*` fields,
  `leadSource`

`components/lead-form.js` auto-populates the UTM/source hidden fields from
the URL on page load, and on submit posts a JSON payload (or just logs it,
see below) and swaps the form for a `.k1-form-success` message — "You're
all set. James will review the details and get in touch to discuss your
event." — not a generic "Thanks for submitting."

## 4. Integration architecture (HubSpot / Make)

```
Landing Page
   ↓ (fetch POST, JSON)
K1_LEAD_ENDPOINT  ←── [NEEDS K1 CONFIRMATION]
   ↓
Make.com scenario  ←── [NEEDS K1 CONFIRMATION: webhook URL, scenario design]
   ↓
HubSpot (create/update contact + deal)  ←── [NEEDS K1 CONFIRMATION: portal ID,
                                              which HubSpot form/API this maps to]
   ↓
Lead notification (email/Slack to James)
   ↓
James follows up with a custom quote
```

`K1_LEAD_ENDPOINT` in `components/lead-form.js` is currently `null`. Until
it's set, form submissions are only logged to the browser console and the
page shows the success state anyway — this lets the page be demoed and
tested without silently losing real leads to a dead endpoint, and without
pretending an integration exists that isn't wired up yet.

**What K1 needs to provide before this goes live:**

- The real submission endpoint (a Make.com webhook URL is simplest, or a
  HubSpot Forms API endpoint + portal/form ID if going direct).
- Confirmation of which HubSpot properties the payload fields should map to
  (e.g. does `tentQuantity` need to be a HubSpot dropdown property with
  matching option values?).
- Who/where the lead notification should go.

## 5. Tracking architecture

- **GA4**: page has a commented-out `gtag.js` snippet in `<head>` —
  [NEEDS K1 CONFIRMATION]: measurement ID.
- **Meta Pixel**: not yet added — [NEEDS K1 CONFIRMATION]: pixel ID, and
  whether Meta ads are actually part of the plan for this campaign.
- **UTM capture**: handled client-side already (see §3) — no confirmation
  needed, works as soon as campaigns append `utm_*` params to the landing
  page URL.
- **Conversion event**: a successful lead form submission should fire a GA4
  event (e.g. `generate_lead`) and, if Meta Pixel is added, a `Lead` event.
  Wire this inside the `showSuccess()` function in `lead-form.js` once the
  tracking IDs above are confirmed — intentionally not added yet since
  firing conversion events against no real pixel/property would pollute
  K1's future analytics with test data.
- Each page's `<body>` carries `data-industry` and `data-landing-page`
  attributes specifically so a future analytics snippet can read them
  without re-deriving from the URL.

## 6. Design system

Brand colors in `design-system.css` are pulled directly from the real K1
logo asset (teal `#5fa8a0` / charcoal `#1c1c1e` / cream `#fbf8f2` / tan
accent), not invented. One conflict to flag:

**[NEEDS K1 CONFIRMATION]** — the brief states the tagline is "Adventure
Made Easy," but the actual logo file reads "Outdoors Made Easy." This
system currently uses the logo's tagline since it's the more authoritative
source. Confirm which is current.

Also needed from K1, not yet available:
- Real logo file (currently a placeholder mountain emoji + wordmark)
- Real event/festival deployment photography (currently uses real K1
  product photos, but none are from an actual festival yet)
- Real customer testimonials (none included — fabricating them would
  violate the brief directly, so the social-proof section is photo-only
  until real quotes/names/events are provided)
- Verified specs beyond what's already confirmed: setup time in minutes,
  any wind rating, any waterproofing certification, delivery radius and
  fees, recommended event booking lead time

## 7. Mobile

Mobile-first: single-column stacking below 900px, sticky bottom CTA bar
below 900px (`.k1-sticky-cta`), large tap targets on the pill-style radio
groups, no scroll-triggered animation, real `<img loading="lazy">` on
gallery photos.

## 8. Next industry pages

Per the brief, build in this order once festival is approved:

1. `/wedding-tent-rentals`
2. `/event-tent-rentals`
3. `/corporate-retreats`
4. `/event-accommodation`

Each one needs its own STEP 1–5 analysis (audience, problem, decision-maker,
objections, value prop) before copy is written — don't reuse festival copy
with nouns swapped.
