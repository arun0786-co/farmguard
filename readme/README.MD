# 🌾 FarmGuard - Smart Farming Platform

FarmGuard is a comprehensive agricultural platform that connects farmers with consumers, provides AI-powered crop monitoring, and facilitates a marketplace for farming supplies.

Tean Members:
1.Fabena Franklin Role:Team Head
2.Niranjan J Role:Advisor and Programmer
3.Arun K Role:Chief Programmer and Designer
4,Alan Francis Role:Designer(Log In Page)
## 🚀 Core Modules

### 1. Sales Platform
- Direct farmer-to-consumer sales
- Wholesale and retail options
- Price management
- Order tracking
- Payment integration
- Delivery management
- Rating system

### 2. AI Monitoring Bot
- Crop monitoring and analysis
- Demand prediction
- Weather integration
- Soil quality analysis
- Disease detection
- Harvest timing optimization

### 3. Marketplace
- Seeds, fertilizers, and farming tools
- Supplier management
- AI-powered recommendations
- Integrated payments
- Delivery tracking

## 💻 Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **AI Integration**: TensorFlow, OpenAI API
- **Payment**: Razorpay (Simulation)
- **Authentication**: NextAuth.js

## 🛠️ Setup Instructions

1. Clone the repository
```bash
git clone [repository-url]
cd farmguard2
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Set up the database
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server
```bash
npm run dev
```

## 🔐 Environment Variables

Create a `.env` file with the following:

```env
DATABASE_URL="mysql://user:password@localhost:3306/farmguard"
NEXTAUTH_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-key"
RAZORPAY_KEY_ID="your-razorpay-key"
RAZORPAY_SECRET="your-razorpay-secret"
```

## 👥 User Types

1. **Farmers (Sellers)**
   - Product listing
   - Order management
   - Analytics dashboard

2. **Consumers (Buyers)**
   - Product browsing
   - Order placement
   - Payment processing

3. **Wholesalers**
   - Bulk ordering
   - Special pricing
   - Direct farmer connection

## 📱 Features

- Responsive design
- Real-time updates
- AI-powered recommendations
- Secure payments
- Order tracking
- Rating system
- Weather integration
- Crop monitoring
- Market analysis

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```   

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel




The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
