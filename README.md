# YouTube Summary

A Next.js application that generates summaries of YouTube videos using their transcripts.

## Features

- Extract transcripts from YouTube videos
- Generate summaries using AI (OpenAI, Anthropic Claude)
- Modern UI built with Tailwind CSS and Radix UI components
- Fully responsive design

## Tech Stack

- **Framework**: Next.js 15.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **AI Integration**: OpenAI API, Anthropic Claude API
- **Other Libraries**:
  - youtube-transcript: For extracting YouTube video transcripts
  - lucide-react: For icons
  - class-variance-authority: For component styling variants
  - tailwind-merge: For merging Tailwind classes

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- API keys for OpenAI and/or Anthropic Claude

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/youtube-summary.git
cd youtube-summary
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```env
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/app`: Next.js app router and main pages
- `/components`: Reusable React components
- `/lib`: Utility functions and shared logic
- `/public`: Static assets

## License

This project is licensed under the MIT License.
