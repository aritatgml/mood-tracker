# Mood Tracker

A responsive mood-tracking web application designed to help users identify their emotions, reflect on their feelings, and build self-awareness.

**[Live Demo](https://aritatgml.github.io/mood-tracker/)** · **[Figma Design](https://www.figma.com/design/P6NTSzUDwfEtP0r28asMvI/Ooca-Assignment?node-id=30-2599)**

## Overview

This project explores a more approachable way to understand emotions through guided emotion selection and structured reflection. Instead of requiring users to identify exactly how they feel right away, the experience guides them through increasingly specific emotion choices and reflection prompts.

## Features

- **Guided emotion selection:** Choose primary, secondary, and tertiary emotions.
- **Structured reflection:** Record thoughts, needs, and bodily sensations or actions.
- **Mood history:** Review and navigate past entries.
- **Responsive interface:** Designed to adapt to different screen sizes.
- **Local data storage:** Mood entries are saved in the browser using `localStorage`.

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Browser `localStorage`

## Getting Started

### Prerequisites

Install [Node.js](https://nodejs.org/) and npm.

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/aritatgml/mood-tracker.git
cd mood-tracker
npm install
```

### Run locally

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Run utility tests

```bash
npm run test:utils
```

## Data Storage

This application does not use a backend database. Mood entries are stored locally in the browser, so they are not automatically synchronized across devices.

## Project Structure

- `src/data/` — Emotion data, emotion themes, and reflection questions
- `src/utils/` — Date, entry, and storage utilities
- `src/hooks/` — Mood entry management and related hooks
- `src/components/` — Reusable UI, mood-tracking, calendar, and layout components
- `src/pages/` — Main application pages
- `src/styles/` — Design tokens, typography, and component styles

## Design

The interface follows the provided OOCA style guide, with design decisions focused on making emotion selection and reflection approachable and easy to follow.
