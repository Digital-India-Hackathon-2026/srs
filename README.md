# SevaSetu MVP

AI-powered multilingual Government Service Navigator for the Digital India Hackathon.

## Features
- 4 services: Aadhaar, Passport, Income Certificate, PM Kisan Scheme
- English, Hindi, Telugu language switch
- Verified-source style service pages
- RAG-style AI assistant
- Smart document checklist
- Eligibility checker
- Nearby office demo by PIN code
- Clean premium civic UI

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open: http://localhost:3000

## AI Setup
Add your Gemini API key in `.env.local`:

```env
GEMINI_API_KEY=your_key_here
```

If no key is added, the chatbot returns safe mock answers from the knowledge base.

## Important
The data is demo/sample hackathon content. Before final submission, verify Aadhaar, Passport, Income Certificate, and PM Kisan details from official government websites.
