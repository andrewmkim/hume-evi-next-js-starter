# VoiceVitals+ - Voice Journaling with Emotion Analysis

A Next.js application that uses Hume AI for real-time voice emotion analysis and OpenAI for therapeutic feedback.

## Features

- Real-time voice recording and transcription
- Emotion analysis using Hume AI
- Therapeutic feedback using OpenAI
- Session history and emotion trends
- Beautiful, responsive UI

## Prerequisites

- Node.js 18.x or later
- pnpm (recommended) or npm
- Hume AI API key
- OpenAI API key (for therapeutic feedback)

## Obtaining API Keys

### Hume AI API Key
1. Visit [Hume AI Dashboard](https://beta.hume.ai/settings/keys)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and save it securely

### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the key and save it securely

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd hume-evi-next-js-starter
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory with:
   ```
   NEXT_PUBLIC_HUME_API_KEY=your_hume_api_key_here
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   Replace the placeholder values with your own API keys obtained from the steps above.

4. **Run the development server**
   ```bash
   pnpm run dev
   # or
   npm run dev
   ```

5. **Open the application**
   Visit [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── checkin/          # Check-in page
│   └── trends/           # Trends page
├── components/            # React components
├── lib/                   # Utility functions
├── public/               # Static assets
└── types/                # TypeScript type definitions
```

## Key Features Implementation

- **Voice Recording**: Uses Hume AI's voice SDK for real-time recording and analysis
- **Emotion Analysis**: Processes voice data to extract emotional insights
- **Therapeutic Feedback**: Integrates with OpenAI for personalized feedback
- **Data Visualization**: Shows emotion trends and session history

## Troubleshooting

1. **Build Errors**
   - Ensure all environment variables are set
   - Check Node.js version (should be 18.x or later)
   - Run `pnpm install` to ensure all dependencies are installed

2. **Voice Recording Issues**
   - Check browser permissions for microphone access
   - Ensure Hume AI API key is valid
   - Check browser console for any errors

3. **API Errors**
   - Verify API keys are correctly set in `.env.local`
   - Check network tab in browser dev tools for specific error messages

## Contact

For any questions or issues, please contact andrewmk@usc.edu

