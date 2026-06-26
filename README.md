# Urban Health Pulse

A future-city health monitoring platform. Residents log symptoms anonymously; AI detects city-wide outbreak patterns before they hit hospitals.

## Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env        # add your ANTHROPIC_API_KEY
npx prisma db push          # creates the SQLite database
npm run dev                 # runs on http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev                 # runs on http://localhost:3000
```

## Pages

| Route | What it does |
|---|---|
| `/log` | Log symptoms + severity + district |
| `/my-health` | Personal timeline and severity chart |
| `/city-map` | Leaflet map with district-level heatmap |
| `/insights` | Claude AI analysis — personal and city-wide |

## Demo flow for judges

1. Log 5–7 symptom entries across different districts
2. Go to City Map — see the heatmap populate
3. Go to Insights → Analyze City Data
4. Claude surfaces patterns like *"Respiratory symptoms spiking in Woodlands and Ang Mo Kio — medium alert"*

## Notes

- `userId` is hardcoded as `demo-user` — swap in Clerk for real auth
- SQLite is fine for the hackathon; swap to Postgres for production
- The Leaflet CSS **must** be imported in `main.tsx` before `index.css` or the map breaks
