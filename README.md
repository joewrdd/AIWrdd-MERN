# WrddAI Content Generator

A powerful AI-driven content generation platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that helps users create high-quality, engaging content with an intuitive user interface & a sleek easy payment getaway.

## Features

🤖 **AI-Powered Content Generation**

- Advanced AI algorithms for content creation
- Multiple content types and styles
- Tone customization options
- Category-specific content generation

💳 **Flexible Subscription Plans**

- Free trial period
- Multiple subscription tiers (Free, Basic, Premium)
- Stripe payment integration
- Monthly credit system

👤 **User Management**

- Secure authentication system
- User profile management
- Content generation history
- Credit usage tracking

🎨 **Modern UI/UX**

- Responsive design
- Dark theme
- Interactive components
- Framer Motion animations

## Technical Stack

### Frontend

- React.js with Hooks
- TailwindCSS for styling
- Framer Motion for animations
- React Query for state management
- Formik & Yup for form handling
- Stripe Elements for payments

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT authentication
- Google's Generative AI integration
- Stripe payment processing
- Cron jobs for subscription management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe account
- Google AI API key

### Installation

1. Clone the repository

```bash
git clone https://github.com/joewrdd/AIWrdd-MERN.git
```

2. Install server dependencies

```bash
cd server
npm install
```

3. Install client dependencies

```bash
cd client
npm install
```

4. Set up environment variables

```bash
# Server .env
PORT=3008
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_ai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Client .env
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
REACT_APP_API_URL=http://localhost:3008
```

5. Start the development servers

```bash
# Start Backend Server
cd server
npm run server

# Start Frontend Development Server
cd client
npm start
```

## API Endpoints

### Authentication

- POST `/api/users/register` - User registration
- POST `/api/users/login` - User login
- POST `/api/users/logout` - User logout
- GET `/api/users/profile` - Get user profile

### Content Generation

- POST `/api/openai/generate-content` - Generate AI content
- GET `/api/history/:id` - View content history
- PUT `/api/history/:id` - Update content
- DELETE `/api/history/:id` - Delete content

### Payments

- POST `/api/stripe/checkout` - Create payment intent
- POST `/api/stripe/webhook` - Handle Stripe webhooks
- POST `/api/stripe/free-plan` - Activate free plan
- POST `/api/stripe/verify-payment/:paymentId` - Verify payment

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── apis/          # API integration
│   │   ├── auth/          # Authentication context
│   │   ├── components/    # React components
│   │   └── config/        # Configuration files
│
├── server/                 # Node.js backend
│   ├── controllers/       # Route controllers
│   ├── middlewares/       # Custom middlewares
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   └── utils/            # Utility functions
```

## Contributing

Contributions Are Welcome! Please Feel Free To Submit A Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```

```
