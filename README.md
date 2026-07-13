# App-Idea-Generator

An AI-powered web application that generates creative, comprehensive, and well-structured app concepts based on user descriptions or custom prompts.

🚀 Features

- **Custom Prompt Input:** Users can provide details or random ideas for an app they want to create.
- **AI-Powered Concept Generation:** Integrates with OpenAI's `gpt-4o-mini` model to transform minimal prompts into fully detailed app ideas.
- **Comprehensive Structure:** Each generated response automatically details:
  1. App Name (creative and catchy)
  2. One-line Description
  3. Target Audience
  4. Core Features (3-5 key features)
  5. Unique Value Proposition
  6. Monetization Strategy
  7. Technology Stack Suggestions
- **User Interface Features:** Includes a clean UI with interactive components, suggestion chips for prompt inspiration, a clear button, and a dedicated section for viewing the generated app idea structure.

📁 Project Structure

The codebase is organized into logical directories for scalability:
```text
App-Idea-Generator/
├── public/              # Static assets (HTML, CSS, JS frontend files)
├── views/               # Views/Templates (EJS template files)
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore configurations
├── package.json         # Project dependencies and npm scripts
└── server.js            # Main Express server entry point
```

🛠️ Tech Stack

- **Backend Framework:** Node.js with Express.js
- **Frontend Template Engine:** HTML5 / EJS (Embedded JavaScript)
- **Styling:** Custom CSS
- **AI Integration:** OpenAI API (`gpt-4o-mini`)

⚙️ Getting Started

### Prerequisites
- Node.js (v16.x or higher)
- npm or yarn
- OpenAI API Key

### Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/krrish-kohli/App-Idea-Generator.git
   cd App-Idea-Generator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   - Duplicate `.env.example` and name it `.env`
   - Add your OpenAI API key: `OPENAI_API_KEY=your-api-key-here`
4. Start the server:
   ```bash
   npm start
   ```
