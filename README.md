# Next Love Mom

## Overview

**Next Love Mom** is built using cutting-edge web technologies and modern design principles. This project leverages Next.js as its core framework along with several robust integrations to deliver a performant, feature-rich experience. Key integrations include Clerk for authentication, UploadThing for file uploads, Resend for email handling, and a server-side database powered by Drizzle ORM.

## Features

- **Next.js & Drizzle ORM:** Build fast, data-driven web applications using Next.js in combination with Drizzle ORM for efficient and type-safe database interactions.
- **Memory Vaults:** Create dedicated memory vaults and effortlessly populate them with images and audio memories using UploadThing.
- **Invite-Only Authentication:** Secure user management powered by Clerk, ensuring that the platform remains accessible only to invited users.
- **Email Notifications:** Send engaging email notifications using Resend alongside React Email to keep users informed and connected.
- **Listening to Memories:** Enjoy and relive cherished audio memories anytime through our immersive listening experience.

## Technology Stack

- [Next.js](https://nextjs.org/) – React framework for production
- [Clerk](https://clerk.dev/) – User authentication and management
- [UploadThing](https://uploadthing.com/) – File upload management
- [Resend](https://resend.com/) – Email service
- [Tailwind CSS](https://tailwindcss.com/) – Utility-first CSS framework
- [Drizzle ORM](https://orm.drizzle.team/) – Lightweight ORM for database management
- [React Email](https://react.email/) – Library of React components for crafting emails
- [shadcn/ui](https://ui.shadcn.com) – Component library built with Tailwind CSS
- [Simplex-noise](https://www.npmjs.com/package/simplex-noise) – Generate procedural noise effects for creative design elements

## Getting Started

To run this project locally, follow these steps.

### Installation

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd next-love-mom
   ```

2. **Install Dependencies**

   Using Yarn:

   ```bash
   yarn install
   ```

   or using npm:

   ```bash
   npm install
   ```

3. **Environment Variables**

   Create a `.env` file in the root of your project and add the following environment variables:

   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   DATABASE_URL=your_database_url
   UPLOADTHING_TOKEN=your_uploadthing_token
   RESEND_API_KEY=your_resend_api_key
   ```

   These variables are essential for authentication, database connectivity, file uploads, and email services.

4. **Run the Development Server**

   Using Yarn:

   ```bash
   yarn dev
   ```

   or using npm:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Deployment

This project is built with Next.js and is deployed on vercel. [https://www.iloveyouforever.live](https://www.iloveyouforever.live)

## Project Structure

The project is organized in a modular way to promote code reusability and maintainability:

- **/app:** Houses route-based pages, layouts, API endpoints, and server actions. It is organized by feature areas to separate concerns.
- **/app/actions:** Contains server actions and API integration logic.
- **/components:** Contains presentational and reusable UI components (buttons, dialogs, cards, etc.), many of which are built using shadcn/ui and Tailwind CSS.
- **/hooks:** Custom React hooks for client-side state management and interactions (e.g., toast notifications).
- **/lib:** Utility functions, third-party integrations, and environment configuration are located here.
- **/lib/db:** Contains database migrations, schema definitions, and ORM query logic using Drizzle ORM.
- **/public:** Stores static assets such as images, icons, and other media.
- **/types:** Contains type definitions and interfaces used throughout the project for enhanced type safety and code clarity.

## Acknowledgments

This project dedicated to my mom, inspired by a book she used to read to me when I was a kid.

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Your Name - [phetzel89@gmail.com](mailto:phetzel89@gmail.com)

Project Link: [https://github.com/phetzel/next-love-mom](https://github.com/phetzel/next-love-mom)
