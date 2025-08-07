
# Naija Pitch Connect

## 1. Application Overview

**Naija Pitch Connect** is a comprehensive web platform designed to bridge the gap between football players and pitch owners across Nigeria. It provides a seamless, centralized marketplace for finding, booking, and managing football pitches. The application caters to three distinct user roles: Players, Pitch Owners, and a Platform Administrator, each with a dedicated dashboard and feature set.

-   **For Players**: The platform simplifies the process of finding and reserving a football pitch. Players can search for pitches by location, view details and amenities, check real-time availability, and book a slot securely online.
-   **For Pitch Owners**: It serves as a powerful business management tool. Owners can list their pitches, manage their booking calendars, track revenue, handle payouts, and gain insights into their business performance.
-   **For Administrators**: The admin panel provides a god-mode view of the entire platform, enabling user management, platform-wide analytics, revenue tracking, and content moderation to ensure a safe and reliable service.

## 2. Technology Stack

The application is built on a modern, robust, and scalable technology stack, prioritizing developer experience and performance.

-   **Core Framework**: **Next.js 15** (using the App Router) - A production-grade React framework providing server-side rendering, static site generation, and a powerful routing system.
-   **Language**: **TypeScript** - For type safety, improved code quality, and better developer tooling.
-   **UI Components**: **ShadCN UI** - A collection of beautifully designed, accessible, and reusable components built on top of Radix UI and Tailwind CSS. This allows for rapid development of a consistent and professional user interface.
-   **Styling**: **Tailwind CSS** - A utility-first CSS framework for creating custom designs without leaving the HTML. The project uses a theme-based approach with CSS variables for easy customization of colors and styles.
-   **Form Management**: **React Hook Form** with **Zod** for validation - For building performant, flexible, and easily validated forms.
-   **AI & Generative Features**: **Genkit** - Google's open-source framework for building AI-powered features, used here for the pitch recommendation engine.
-   **Data & State**: For this prototype, the application uses in-memory arrays and browser `localStorage` to simulate a database and user sessions. In a production environment, this would be replaced by a database like **Firebase Firestore**.

### Key npm Packages:

-   `next`: The core Next.js framework.
-   `react`, `react-dom`: The UI library.
-   `tailwindcss`, `class-variance-authority`, `clsx`: For styling and utility class management.
-   `lucide-react`: For a comprehensive set of high-quality icons.
-   `@radix-ui/*`: The underlying primitive components for ShadCN UI (dialogs, dropdowns, etc.).
-   `react-hook-form`, `@hookform/resolvers`, `zod`: For robust form handling and validation.
-   `genkit`, `@genkit-ai/googleai`: For integrating generative AI features.
-   `recharts`: For displaying charts and analytics in the dashboards.
-   `date-fns`: For reliable date manipulation and formatting.
-   `html2canvas`: Used for generating images from HTML, specifically for sharing receipts.

## 3. Feature Breakdown & Section Explanations

### Public & Authentication Flow (`/`, `/about`, `/login`, `/signup`)

-   **Homepage (`/`)**: The landing page that introduces the platform's value proposition to new users.
-   **Authentication**:
    -   **Signup (`/signup`)**: Separate, tailored registration forms for Players and Pitch Owners.
    -   **Login (`/login`)**: A unified login page that directs Players and Owners to their respective dashboards.
    -   **Password Reset**: A secure flow (`/forgot-password`, `/verify-reset-code`, `/reset-password`) for users to recover their accounts.

### Player Dashboard (`/dashboard`)

This section is the player's hub for all their footballing activities.

-   **Pitch Discovery (`/dashboard`)**: A grid view of all available pitches. Players can search by name or location.
-   **Booking Page (`/dashboard/book/[pitchId]`)**: A detailed page for a specific pitch where a player can:
    -   Select a date (within a 1-week advance window).
    -   Choose one or more available time slots.
    -   View the total cost.
    -   Complete the booking via a simulated bank transfer.
-   **Booking History (`/dashboard/history`)**: A table listing all past and upcoming bookings for the logged-in player.
-   **Receipt Page (`/dashboard/receipt/[bookingId]`)**: A detailed, shareable, and printable receipt for each confirmed booking, personalized with the player's name.
-   **Profile Management (`/dashboard/profile`)**: Allows players to update their personal information, change their password, and switch app themes.

### Pitch Owner Dashboard (`/owner/dashboard`)

This is the command center for pitch owners to manage their business.

-   **Main Dashboard (`/owner/dashboard`)**: An overview of key metrics, including total revenue, active pitches, and recent booking activity. It also includes a commission calculator.
-   **My Pitches (`/owner/dashboard/pitches`)**:
    -   Lists all pitches owned by the user.
    -   Allows for adding new pitches and editing existing ones through a comprehensive dialog.
    -   Owners can activate or deactivate pitches.
-   **Availability Management (`/owner/dashboard/pitches/[pitchId]/availability`)**:
    -   A calendar-based interface to view the schedule for a specific pitch.
    -   Owners can see booked vs. available slots.
    -   They can add **manual bookings** for offline customers (limited to 2 per day) to prevent double-booking.
-   **Bookings (`/owner/dashboard/bookings`)**: A complete history of all bookings (both online and manual) made for their pitches.
-   **Wallet (`/owner/dashboard/wallet`)**:
    -   Shows the owner's current balance after commissions.
    -   Allows owners to initiate withdrawals to their bank account.
    -   Provides a complete transaction history (credits from bookings, debits from withdrawals).
-   **Payouts & Subscriptions (`/owner/dashboard/payouts`, `/owner/dashboard/pricing`)**:
    -   A detailed breakdown of all payouts, showing gross amounts, commission fees, and net earnings.
    -   A page to manage their subscription plan (currently a prototype).
-   **Profile (`/owner/dashboard/profile`)**: Owners can update their business information, change their password, and set a transaction PIN for withdrawals.

### Admin Dashboard (`/admin`)

The central control panel for overseeing the entire platform. Access is restricted via a separate login (`/admin/login`).

-   **Platform Overview (`/admin/dashboard`)**: High-level statistics including total platform revenue, user counts, total pitches, and recent user/booking activity.
-   **User Management (`/admin/dashboard/users`)**: A list of all users (Players and Owners). Admins can view user details, suspend, or delete accounts.
-   **Pitch Management (`/admin/dashboard/pitches`)**: A list of every pitch on the platform. Admins can view details and unlist any pitch if necessary.
-   **Booking & Revenue Management (`/admin/dashboard/bookings`, `/admin/dashboard/revenue`)**: View all bookings and a detailed breakdown of all commission revenue earned by the platform.
-   **Admin Wallet (`/admin/dashboard/wallet`)**: Tracks the platform's total earnings and allows the admin to simulate withdrawals and payouts to owners.

## 4. How to Run the Project Locally

To run the application on your local machine, follow these steps:

1.  **Install Dependencies**: Open your terminal in the project's root directory and run:
    ```bash
    npm install
    ```
    This will install all the required packages listed in `package.json`.

2.  **Run the Development Server**: Once the installation is complete, start the Next.js development server:
    ```bash
    npm run dev
    ```
    This command will start the application, typically on `http://localhost:9002`. You can now access the app in your web browser.

## 5. Project Structure

The project follows the standard Next.js App Router structure. Here are the key directories:

-   **/src/app/**: The core of the application, containing all routes and pages.
    -   **/src/app/(auth)/**: Routes for the authentication flow (login, signup).
    -   **/src/app/admin/**: All pages related to the Admin Dashboard.
    -   **/src/app/dashboard/**: All pages related to the Player Dashboard.
    -   **/src/app/owner/**: All pages related to the Pitch Owner Dashboard.
    -   **/src/app/page.tsx**: The homepage of the application.
    -   **/src/app/layout.tsx**: The root layout for the entire application.
    -   **/src/app/globals.css**: Global styles and Tailwind CSS directives.
-   **/src/components/**: Contains all reusable React components.
    -   **/src/components/ui/**: Auto-generated ShadCN UI components.
    -   **/src/components/admin/**: Components specific to the admin dashboard.
-   **/src/lib/**: Contains utility functions and data definitions.
    -   **`placeholder-data.ts`**: Simulates the application's database with in-memory data.
    -   **`types.ts`**: TypeScript type definitions for objects like `User`, `Pitch`, and `Booking`.
    -   **`utils.ts`**: General utility functions, such as `cn` for combining CSS classes.
-   **/src/hooks/**: Custom React hooks, such as `use-toast.ts` for handling notifications.
-   **/public/**: For static assets like images and fonts.
-   **`tailwind.config.ts`**: Configuration file for Tailwind CSS.
-   **`next.config.ts`**: Configuration file for Next.js.
