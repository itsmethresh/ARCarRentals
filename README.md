# AR Car Rental Services

A production-ready React website for car rental and tour services in Cebu City, built with Vite, TypeScript, and Tailwind CSS.

![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=flat-square&logo=tailwind-css)

## 🚀 Features

- ⚡ **Vite** - Lightning fast build tool with HMR
- ⚛️ **React 19** - Latest React with concurrent features
- 📘 **TypeScript** - Strict type checking for reliability
- 🎨 **Tailwind CSS 4** - Utility-first styling with custom theme
- 🛣️ **React Router** - Client-side routing
- 🔄 **TanStack Query** - Powerful data fetching and caching
- 🧪 **Vitest** - Fast unit testing with React Testing Library
- 📏 **ESLint + Prettier** - Code quality and formatting
- 📱 **Responsive Design** - Mobile-first approach
- ♿ **Accessibility** - WCAG compliant components

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, fonts, etc.)
├── components/       # Reusable UI components
│   ├── layout/       # Layout components (Header, Footer, etc.)
│   ├── sections/     # Page sections (Hero, Features, etc.)
│   └── ui/           # Base UI components (Button, Card, etc.)
├── hooks/            # Custom React hooks
├── pages/            # Page components
├── routes/           # Route configuration
├── services/         # API service layer
├── styles/           # Global styles and CSS
├── tests/            # Test utilities and setup
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and helpers
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher (or pnpm/yarn)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/arcarrentals.git
cd arcarrentals
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run typecheck` | Run TypeScript type checking |

## 🎨 Design System

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#dc2626` | Buttons, links, accents |
| Primary Dark | `#b91c1c` | Hover states |
| Neutral 900 | `#171717` | Text, dark backgrounds |
| Neutral 500 | `#737373` | Secondary text |
| White | `#ffffff` | Backgrounds, cards |

### Typography

- **Headings**: Poppins (600-800 weight)
- **Body**: Inter (400-600 weight)

### Spacing

Uses an 8px base grid system with spacing tokens:
- `spacing-1`: 4px
- `spacing-2`: 8px
- `spacing-4`: 16px
- `spacing-6`: 24px
- `spacing-8`: 32px

## 🧪 Testing

The project uses Vitest with React Testing Library for testing.

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests once
npm run test:run

# Run with coverage report
npm run test:coverage
```

### Test File Conventions

- Test files: `*.test.ts` or `*.test.tsx`
- Test utilities: `src/tests/test-utils.tsx`
- Setup file: `src/tests/setup.ts`

### Writing Tests

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/tests/test-utils';
import { Button } from '@components/ui/Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Application
VITE_APP_NAME=AR Car Rentals
VITE_APP_VERSION=1.0.0

# API
VITE_API_BASE_URL=http://localhost:8080/api
VITE_API_TIMEOUT=30000

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=true
```

### Path Aliases

The project uses path aliases for cleaner imports:

```typescript
import { Button } from '@components/ui';
import { useScroll } from '@hooks/index';
import { config } from '@utils/config';
```

Available aliases:
- `@/*` → `src/*`
- `@components/*` → `src/components/*`
- `@pages/*` → `src/pages/*`
- `@hooks/*` → `src/hooks/*`
- `@services/*` → `src/services/*`
- `@utils/*` → `src/utils/*`
- `@types/*` → `src/types/*`
- `@styles/*` → `src/styles/*`
- `@assets/*` → `src/assets/*`
- `@routes/*` → `src/routes/*`

## 📦 Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` directory.

### Build Optimization

The build includes:
- Code splitting for vendor and UI libraries
- Tree shaking for unused code
- Minification and compression
- Source maps for debugging

## 🚀 Deployment

### Static Hosting (Vercel, Netlify, etc.)

1. Connect your repository to your hosting platform
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Configure environment variables

### Docker

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 📄 API Integration

The project includes a pre-configured API service layer:

```typescript
import { carService } from '@services/index';

// Get all cars
const cars = await carService.getAllCars();

// Search cars
const results = await carService.searchCars({
  pickupLocation: 'Cebu City',
  pickupDate: '2026-02-01',
  carType: 'suv',
});
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a Pull Request

### Code Style

- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Include tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **AR Car Rentals** - Development Team

## 📞 Support

For support, email info@arcarrentals.com or visit our website.

---

Built with ❤️ in Cebu City, Philippines
