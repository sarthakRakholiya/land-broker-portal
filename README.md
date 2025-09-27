# DB Vekariya - Land Broker Website

A comprehensive land broker website built with Next.js 15, TypeScript, and Tailwind CSS. Features a modern, professional design with smooth animations and a clean black and white theme.

## 🚀 Features

- **Modern Login System**: Clean, professional login page with form validation
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion powered transitions and micro-interactions
- **Professional Theme**: Black and white color scheme with accent colors
- **Route Transitions**: Smooth page transitions with loading states
- **Form Components**: Reusable form components with React Hook Form and Zod validation
- **Dashboard**: Comprehensive dashboard with statistics and quick actions
- **Property Management**: Property listing and management interface
- **Navigation**: Sidebar navigation with active state indicators

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI primitives

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── login/             # Login page
│   ├── dashboard/         # Dashboard page
│   ├── properties/        # Properties listing page
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── common/           # Common UI components
│   │   ├── AnimatedContainer.tsx
│   │   ├── Loader.tsx
│   │   ├── Navigation.tsx
│   │   └── RouteLoader.tsx
│   └── form/             # Form components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── FormError.tsx
├── schemas/              # Zod validation schemas
│   └── auth.ts
├── utils/                # Utility functions
│   └── cn.ts
└── types/                # TypeScript type definitions
```

## 🎨 Design System

### Colors

- **Primary**: Professional black (#171717)
- **Secondary**: Light gray (#f8f9fa)
- **Accent**: Subtle gray (#f4f4f5)
- **Success**: Green (#22c55e)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)

### Typography

- **Font Family**: Inter (Google Fonts)
- **Font Weights**: 300, 400, 500, 600, 700

### Animations

- **Fade In**: Smooth opacity transitions
- **Slide In**: Directional slide animations
- **Scale In**: Subtle scale effects
- **Route Transitions**: Page change animations

## 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages

### Login Page (`/login`)

- Clean, professional login form
- Email and password validation
- Smooth animations and loading states
- Redirects to dashboard on successful login

### Dashboard (`/dashboard`)

- Overview statistics
- Quick action buttons
- Sidebar navigation
- Responsive grid layout

### Properties (`/properties`)

- Property listing grid
- Search and filter functionality
- Property cards with details
- Add property button

## 🔧 Customization

### Adding New Colors

Update `tailwind.config.ts` to add new colors to the theme:

```typescript
colors: {
  // Add your custom colors here
  custom: {
    50: '#f0f9ff',
    500: '#3b82f6',
    900: '#1e3a8a',
  }
}
```

### Adding New Animations

Add custom animations to `tailwind.config.ts`:

```typescript
animation: {
  'custom-bounce': 'customBounce 2s infinite',
},
keyframes: {
  customBounce: {
    '0%, 100%': { transform: 'translateY(0)' },
    '50%': { transform: 'translateY(-10px)' },
  },
}
```

## 📦 Dependencies

### Core

- `next`: 15.5.4
- `react`: 19.1.0
- `typescript`: ^5

### Styling & UI

- `tailwindcss`: ^4
- `framer-motion`: ^12.23.22
- `lucide-react`: ^0.544.0
- `@radix-ui/*`: Various UI primitives

### Forms & Validation

- `react-hook-form`: ^7.63.0
- `@hookform/resolvers`: ^5.2.2
- `zod`: ^4.1.11

### Utilities

- `clsx`: ^2.1.1
- `tailwind-merge`: ^3.3.1

## 🎯 Future Enhancements

- [ ] User authentication with NextAuth.js
- [ ] Database integration with Prisma
- [ ] Property search and filtering
- [ ] Client management system
- [ ] Reports and analytics
- [ ] File upload for property images
- [ ] Email notifications
- [ ] Mobile app integration

## 📄 License

This project is proprietary software for DB Vekariya Land Broker Services.

---

Built with ❤️ for DB Vekariya Land Broker Services
