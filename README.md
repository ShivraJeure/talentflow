
# TalentFlow

TalentFlow is an employee skill management and project allocation platform built with React. It helps teams explore employee capabilities, evaluate skill gaps, and identify potential project matches.

## Features

- Employee directory with search, filtering, sorting, and profiles
- Project management and employee allocation workflows
- Skill matrix and skill-gap analysis
- Dashboard analytics for employees, projects, and skills
- Dark mode and responsive interface
- AI-assisted employee matching with a rule-based fallback
- REST API integration through Axios

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Redux Toolkit
- Axios
- Tailwind CSS

### Backend
- Node.js and Express, if used by the current server
- Optional OpenAI integration
- Rule-based matching fallback

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShivraJeure/talentflow.git
cd talentflow
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Configure frontend environment

Create a local `.env` file using `.env.example` as a reference.

Set `VITE_API_BASE_URL` to the API base URL used by your backend.

### 4. Start the frontend

```bash
npm run dev
```

### 5. Start the backend

Open another terminal and navigate to the existing server directory.

Install the server dependencies and run the start command defined in its `package.json`.

Configure private backend environment variables in `server/.env`.

## AI Matching

TalentFlow supports employee matching based on relevant skills and project requirements. When configured, the application can use the optional OpenAI integration. The rule-based fallback allows matching to continue when the AI provider is unavailable.

Keep private API credentials on the backend. Never expose them in frontend environment variables.

## Production Build

```bash
npm run build
```

The generated frontend bundle is written to `dist/`.

## Environment Variables

See `.env.example` and `server/.env.example` for the expected variable names. Use deployment-specific values in the hosting provider's environment settings.

## Future Improvements

- Automated unit and integration tests
- Role-based access control
- Improved project utilization analytics
- More comprehensive AI matching evaluation

## Author

Shivraj Jeure
