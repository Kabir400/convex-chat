# 🚀 Convex Real-Time Chat App

A modern, high-performance real-time chat application built with **Next.js**, **Convex**, **Clerk**, and **Tailwind CSS**. This application features direct messaging, group chats, real-time presence, typing indicators, and emoji reactions.

---

## ✨ Features

### 🔐 Authentication & Profiles

- **Powered by Clerk**: Support for Email/Password and Social Login (Google, etc.).
- **User Sync**: User profiles are automatically stored and updated in Convex for discoverability.
- **Profile UI**: Displays user names and avatars throughout the application.

### 💬 Messaging Experience

- **Direct Messages**: High-speed, 1-on-1 private conversations.
- **Group Chats**: Create group conversations with multiple members and a custom group name.
- **Real-Time Updates**: Messages appear instantly without page refreshes using Convex subscriptions.
- **Message Reactions**: React to messages with a set of emojis (👍, ❤️, 😂, 😮, 😢).
- **Soft Delete**: Delete your own messages with a "This message was deleted" placeholder.
- **Smart Timestamps**:
  - Today's messages: `2:34 PM`
  - Older messages: `Feb 15, 2:34 PM`
  - Previous years: Includes the year (e.g., `Feb 15, 2024, 2:34 PM`)

### ⚡ Real-Time Interactions

- **Online/Offline Status**: Real-time presence indicators (green dot) for users currently active.
- **Typing Indicators**: Visual feedback when someone is typing (e.g., "Alex is typing...").
- **Unread Badges**: Real-time notification badges in the sidebar for new messages.
- **Auto-Scroll**: Automatically scrolls to the latest message.
- **Scroll Memory**: If you've scrolled up to read history, a "↓ New messages" button appears instead of forcing a scroll.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), [Tailwind CSS](https://tailwindcss.com/)
- **Backend/Database**: [Convex](https://convex.dev/) (Real-time backend)
- **Authentication**: [Clerk](https://clerk.com/)
- **Icons/Styling**: [Lucide React](https://lucide.dev/), [Tailwind Merge](https://www.npmjs.com/package/tailwind-merge)

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js (Latest LTS)
- NPM or PNPM
- A Convex account
- A Clerk account

### 2. Clone the Repository

```bash
git clone <your-repo-url>
cd convex-chat-app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Environment Variables

Create a `.env.local` file in the root directory and add the following keys from your Clerk and Convex dashboards:

```env
# Convex Deployment (from npx convex dev)
CONVEX_DEPLOYMENT=your_deployment_id

# Public URL (from Convex Dashboard)
NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud

# Clerk Keys (from Clerk Dashboard)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_ISSUER_URL=https://your-issuer.clerk.accounts.dev

# Clerk Routing
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/login
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/signup
```

### 5. Run the Application

Open two terminals:

**Terminal 1: Start Convex Backend**

```bash
npx convex dev
```

**Terminal 2: Start Next.js Frontend**

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app in action!

---

## 📁 Project Structure

- `/app`: Next.js App Router (Pages, Components, Styles)
- `/convex`: Convex backend functions (Schemas, Queries, Mutations)
- `/public`: Static assets (Images, Icons)

---
