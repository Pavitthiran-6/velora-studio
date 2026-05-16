# W2C Studios — Brutalist Luxury Creative Portfolio

W2C Studios is a high-fidelity, immersive digital portfolio built for a premier creative web studio. The project emphasizes a "brutalist-luxury" aesthetic, combining bold typography, cinematic animations, and interactive WebGL elements to create a premium user experience.

---

## ✨ Key Features

- **Cinematic Motion**: Advanced animation system powered by `Framer Motion` and `GSAP` for fluid, editorial transitions.
- **Immersive 3D Elements**: Interactive WebGL components including a holographic globe and 3D galleries using `Three.js` and `@react-three/fiber`.
- **Global Smooth Scroll**: Custom RAF-based smooth scrolling (Lenis-inspired) integrated with Framer Motion's `useScroll`.
- **Dynamic CMS**: Seamless integration with `Supabase` for real-time content management of projects, reviews, and milestones.
- **Brutalist-Luxury UI**: A unique design language utilizing "Big Shoulders Display" typography, vibrant brand orange (#F89B27), and deep charcoal tones.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Animation**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://greensock.com/gsap/)
- **3D Engine**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Backend/CMS**: [Supabase](https://supabase.com/)
- **Smooth Scroll**: [Lenis](https://lenis.darkroom.engineering/)

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Startup
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory by copying `.env.example`. 

   > [!CAUTION]
   > **NEVER** commit your `.env` file or expose your actual API keys (Supabase, Gemini, etc.) in the `README` or any public repository.
   
   Ensure the following keys are defined in your local `.env`:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GEMINI_API_KEY`
   - `BREVO_API_KEY`

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

---

## 📂 Project Structure

- `src/components`: Reusable UI components and complex sections (Hero, RecentWork, etc.)
- `src/components/admin`: CMS dashboard and management components.
- `src/hooks`: Custom React hooks for global state and animations.
- `src/lib`: Utility functions and third-party configurations (Supabase client, etc.)
- `src/pages`: Individual route components.
- `public/`: Static assets including the brand logo and optimized textures.

---

## 📜 Available Scripts

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Generates the production build in the `dist/` folder.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs TypeScript checks to ensure code quality.

---

## ⚖️ License

Distributed under the Apache-2.0 License. See `LICENSE` for more information.

---

<div align="center">
  <p>Built with ❤️ by W2C Studios Team</p>
</div>
