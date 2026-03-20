# Aryan's Engineering

Static marketing website for Aryan's Engineering.

## Structure

- `index.html` - page markup
- `styles.css` - site styling
- `script.js` - interactions and UI behavior
- `api/send-quote.js` - Resend email handler
- `server.js` - local static server with quote API route

## Deploy

This site includes a server-side quote handler for Resend. Deploy it to a platform that supports serverless functions or Node servers, such as:

- Vercel
- Netlify
- Any Node/serverless host

## Resend Setup

Set this environment variable in your deployment platform:

- `RESEND_API_KEY`

The current handler sends quote enquiries to `aryansengineeringlimited@gmail.com` using `onboarding@resend.dev` as the sender.

## Local Preview

Do not use Live Server for form testing because it cannot handle `POST /api/send-quote`.

Use:

```bash
node server.js
```

Then open [http://localhost:3000](http://localhost:3000).
