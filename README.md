# Aryan's Engineering

Static marketing website for Aryan's Engineering.

## Structure

- `index.html` - page markup
- `styles.css` - site styling
- `script.js` - interactions and UI behavior

## Deploy

This site includes a server-side quote handler for Resend. Deploy it to a platform that supports serverless functions, such as:

- Vercel
- Netlify
- Any Node/serverless host

## Resend Setup

This repository uses a server-side quote endpoint at `api/send-quote.js`.

Set this environment variable in your deployment platform:

- `RESEND_API_KEY`

The current handler sends quote enquiries to `aryansengineeringlimited@gmail.com` using `onboarding@resend.dev` as the sender.

## Local Preview

Open `index.html` in a browser, or serve the folder with any static server.
