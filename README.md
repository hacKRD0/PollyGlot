# Pollyglot

Pollyglot is a real-time translation app that translates text from English to Spanish, French, and Japanese. 

## Features

- Real-time translation from English to Spanish, French, and Japanese.
- Simple and responsive chat interface built with Vite, React, and Tailwind CSS.
- Optimized API calls to Hugging Face models for each target language.
- Cloudflare Worker for managing translation requests and ensuring fast performance.
- Integrated Cloudflare AI Gateway for rate limiting, caching, and securing API endpoints.
- Continuous deployment using Cloudflare Pages with automatic updates.

## Technologies Used

- **Frontend**: Vite, React, Tailwind CSS
- **Backend**: Cloudflare Worker
- **APIs**: Hugging Face Inference Endpoints
- **Cloud Services**: Cloudflare Pages, Cloudflare AI Gateway
- **Deployment**: Cloudflare CLI, Wrangler

## How It Works

1. **Frontend**: The user interacts with a chat interface built using Vite, React, and Tailwind CSS. The chat interface allows users to input text in English and receive translations to their selected target language (Spanish, French, or Japanese).

2. **Cloudflare Worker**: When a translation request is made, the frontend communicates with a Cloudflare Worker. The worker routes the request to a Hugging Face inference endpoint, where the text is processed by a model trained specifically for each language.

3. **Cloudflare AI Gateway**: The API calls to Hugging Face are managed and optimized by Cloudflare AI Gateway, which handles rate limiting and caching to improve performance and prevent excessive API usage.

4. **Deployment**: The frontend is deployed on Cloudflare Pages, leveraging CI/CD to automatically update the app whenever there is a code change. Cloudflare Workers are deployed using Cloudflare's Wrangler CLI tool.

![Pollyglot Demo](/demo.gif)
Link: [Try it yourself!](https://pollyglot-esf.pages.dev/)

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- Cloudflare account with access to Cloudflare Pages and Workers
- Wrangler CLI installed for deploying Cloudflare Workers

### Steps

1. **Clone the repository**

    ```bash
    git clone https://github.com/hacKRD0/Pollyglot.git
    cd Pollyglot
    ```
2. **Install dependencies**
    ```bash
    npm i
    npm run dev // To get the server running
    ```
3. Install the cloudflare cli, create a new worker and deploy the worker using wrangler
    ```bash
    npm create cloudflare@latest --my-first-worker
    cd my-first-worker
    npx wrangler secret put HF_TOKEN // This command will open a prompt where you can enter your huggingface api token
    npx wrangler deploy
    ```
4. Add your huggingface api token as an environment variable with key 'HF_TOKEN'
5. Create an AI gateway on cloudflare and update the url in the index.ts file
