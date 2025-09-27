# DB Vekariya - Land Broker Website

A comprehensive land broker website built with Next.js 15, TypeScript, and Material-UI. Features a modern, professional design with full database integration, authentication, and multi-language support.

## 🚀 Features

### 🔐 Authentication & Security

- **Secure Login System**: JWT-based authentication with demo credentials
- **Protected Routes**: Automatic redirection for unauthorized access
- **Session Management**: Automatic logout on token expiration (401/403)
- **Password Validation**: Strong password requirements with real-time feedback

### 🌍 Internationalization

- **Multi-language Support**: English and Gujarati languages
- **Language Switcher**: Easy language toggle in profile dropdown
- **Persistent Language**: Language preference saved in localStorage
- **Complete Translation**: All UI elements translated including forms, buttons, and messages

### 🏠 Land Management System

- **Land Records Management**: Full CRUD operations for land properties
- **Dynamic Location System**: Create and manage locations on-the-fly
- **Advanced Filtering**: Filter by land type, location, and price range
- **Search Functionality**: Real-time search across all land records
- **Pagination**: Efficient data loading with pagination support

### 📊 Dashboard & Analytics

- **Statistics Overview**: Total lands, total value, and average price
- **Quick Actions**: Add new land records with one click
- **Recent Activity**: Latest land additions and updates
- **Responsive Charts**: Visual representation of land data

### 🎨 User Interface

- **Material-UI Design**: Modern, professional interface
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Toast Notifications**: Success, error, warning, and info messages
- **Loading States**: Smooth loading indicators throughout the app
- **Form Validation**: Real-time validation with helpful error messages

### 🔧 Advanced Features

- **Price Calculation**: Automatic price per area calculation
- **Land Type Management**: Support for various land types (Land, House, Apartment, etc.)
- **Unit Conversion**: Multiple area units (Sq Ft, Sq M, Acre, Hectare)
- **Data Export**: Export land records for external use
- **Error Handling**: Comprehensive error handling with user-friendly messages

## 🛠️ Tech Stack

### Frontend

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context API
- **Icons**: Material-UI Icons
- **Styling**: Material-UI's sx prop system

### Backend

- **Database**: PostgreSQL with Prisma ORM
- **API**: Next.js API Routes
- **Authentication**: JWT tokens
- **Validation**: Zod schemas
- **Error Handling**: Centralized error management

### Development Tools

- **TypeScript**: Type safety and better development experience
- **ESLint**: Code linting and formatting
- **Prisma**: Database ORM and migrations
- **Next.js**: Full-stack React framework

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── api/                   # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── lands/             # Land management endpoints
│   │   └── locations/         # Location management endpoints
│   ├── dashboard/             # Dashboard page
│   ├── login/                 # Login page
│   ├── properties/            # Properties listing page
│   └── layout.tsx             # Root layout with providers
├── components/                # Reusable components
│   ├── common/               # Common UI components
│   │   ├── AnimatedContainer.tsx
│   │   ├── Loader.tsx
│   │   ├── Navigation.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── Toast.tsx
│   ├── dashboard/            # Dashboard-specific components
│   │   ├── AddEditLandModal.tsx
│   │   ├── DashboardHeader.tsx
│   │   ├── LandsFilters.tsx
│   │   └── LandsTable.tsx
│   └── form/                 # Form components
│       ├── Button.tsx
│       ├── Input.tsx
│       └── FormError.tsx
├── contexts/                 # React contexts
│   └── LanguageContext.tsx   # Internationalization context
├── hooks/                    # Custom React hooks
│   └── useAuth.tsx          # Authentication hook
├── lib/                     # Library configurations
│   └── prisma.ts            # Prisma client singleton
├── schemas/                 # Zod validation schemas
│   └── auth.ts
├── services/                # API service layers
│   ├── apiClient.ts         # Centralized API client
│   ├── auth.ts              # Authentication service
│   └── locations.ts         # Location service
├── types/                   # TypeScript type definitions
├── utils/                   # Utility functions
│   ├── cn.ts
│   └── toast.ts
└── messages/                # Translation files
    ├── en.json              # English translations
    └── gu.json              # Gujarati translations
```

## 🎨 Design System

### Colors

- **Primary**: Material-UI primary palette
- **Secondary**: Material-UI secondary palette
- **Success**: Green (#4caf50)
- **Warning**: Orange (#ff9800)
- **Error**: Red (#f44336)
- **Info**: Blue (#2196f3)

### Typography

- **Font Family**: Roboto (Material-UI default)
- **Font Weights**: 300, 400, 500, 600, 700

### Components

- **Material-UI**: Consistent design system
- **Responsive**: Mobile-first approach
- **Accessibility**: WCAG compliant components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd db-vekariya-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Add your environment variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/db_vekariya"
   JWT_SECRET="your-secret-key"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed the database with initial data
   npm run db:seed
   ```

   Or use the combined setup command:

   ```bash
   npm run db:setup
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Demo Credentials

- **Email**: admin@dbvekariya.com
- **Password**: admin123

## 📱 Pages & Features

### Login Page (`/login`)

- Secure authentication with JWT
- Form validation with real-time feedback
- Language switching support
- Automatic redirection after login

### Dashboard (`/dashboard`)

- **Statistics Cards**: Total lands, total value, average price
- **Quick Actions**: Add new land records
- **Recent Activity**: Latest land additions
- **Language Switcher**: Toggle between English and Gujarati

### Properties (`/properties`)

- **Land Records Table**: Comprehensive land listing
- **Advanced Filters**: Filter by type, location, price range
- **Search**: Real-time search functionality
- **Pagination**: Efficient data loading
- **Add/Edit Modal**: Create and update land records
- **Delete Functionality**: Remove land records with confirmation

### Land Management Features

- **Dynamic Locations**: Create new locations on-the-fly
- **Land Types**: Support for various property types
- **Price Calculation**: Automatic price per area calculation
- **Unit Conversion**: Multiple area measurement units
- **Form Validation**: Comprehensive input validation

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Land Management

- `GET /api/lands` - Get all land records with filtering
- `POST /api/lands` - Create new land record
- `GET /api/lands/[id]` - Get specific land record
- `PUT /api/lands/[id]` - Update land record
- `DELETE /api/lands/[id]` - Delete land record

### Location Management

- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create new location

## 🌍 Internationalization

The application supports two languages:

- **English** (en) - Default language
- **Gujarati** (gu) - Regional language

### Adding New Languages

1. Create new translation file in `src/messages/`
2. Add language option to `LanguageContext.tsx`
3. Update language switcher component

### Translation Keys

All UI text uses translation keys for easy maintenance:

```typescript
// Example usage
const { t } = useLanguage();
const title = t("dashboard.title");
```

## 🗄️ Database Schema

### Users Table

- `id`: Unique identifier
- `name`: User's full name
- `email`: User's email address
- `password`: Hashed password
- `createdAt`: Account creation timestamp
- `updatedAt`: Last update timestamp

### Locations Table

- `id`: Unique identifier
- `name`: Location name
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

### Lands Table

- `id`: Unique identifier
- `fullName`: Property owner name
- `type`: Land type (LAND, HOUSE, APARTMENT, etc.)
- `landArea`: Area measurement
- `landAreaUnit`: Unit of measurement
- `totalPrice`: Total property price
- `locationId`: Foreign key to locations
- `userId`: Foreign key to users
- `createdAt`: Creation timestamp
- `updatedAt`: Last update timestamp

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password hashing
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: React's built-in XSS protection
- **CSRF Protection**: Next.js built-in CSRF protection

## 📦 Dependencies

### Core

- `next`: 15.5.4 - React framework
- `react`: 19.1.0 - UI library
- `typescript`: ^5 - Type safety

### UI & Styling

- `@mui/material`: ^5.15.0 - Material-UI components
- `@mui/icons-material`: ^5.15.0 - Material-UI icons
- `@emotion/react`: ^11.11.0 - CSS-in-JS library
- `@emotion/styled`: ^11.11.0 - Styled components

### Forms & Validation

- `react-hook-form`: ^7.63.0 - Form management
- `@hookform/resolvers`: ^5.2.2 - Form validation resolvers
- `zod`: ^4.1.11 - Schema validation

### Database & API

- `@prisma/client`: ^5.7.0 - Database ORM
- `prisma`: ^5.7.0 - Database toolkit
- `bcryptjs`: ^2.4.3 - Password hashing
- `jsonwebtoken`: ^9.0.2 - JWT tokens

### Utilities

- `clsx`: ^2.1.1 - Conditional class names
- `date-fns`: ^2.30.0 - Date manipulation

## 🚀 Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Variables

Ensure all required environment variables are set:

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `NEXT_PUBLIC_API_URL`: API base URL

### Database Migration

```bash
# Deploy migrations to production
npm run db:migrate:deploy

# Seed production database
npm run db:seed
```

## 🗄️ Database Management

### Available Scripts

| Command                     | Description                             |
| --------------------------- | --------------------------------------- |
| `npm run db:generate`       | Generate Prisma client                  |
| `npm run db:push`           | Push schema changes to database         |
| `npm run db:migrate`        | Create and apply new migration          |
| `npm run db:migrate:deploy` | Deploy migrations to production         |
| `npm run db:migrate:reset`  | Reset database and apply all migrations |
| `npm run db:migrate:status` | Check migration status                  |
| `npm run db:seed`           | Seed database with initial data         |
| `npm run db:studio`         | Open Prisma Studio (database GUI)       |
| `npm run db:setup`          | Complete setup (generate + push + seed) |
| `npm run db:reset`          | Reset database and reseed               |

### Development Workflow

1. **Make schema changes** in `prisma/schema.prisma`
2. **Create migration**:
   ```bash
   npm run db:migrate
   ```
3. **Test changes** in development
4. **Deploy to production**:
   ```bash
   npm run db:migrate:deploy
   ```

### Common Database Operations

#### Reset Database (Development)

```bash
# Reset and reseed database
npm run db:reset
```

#### Check Migration Status

```bash
# See which migrations have been applied
npm run db:migrate:status
```

#### Open Database GUI

```bash
# Open Prisma Studio for visual database management
npm run db:studio
```

#### Create New Migration

```bash
# Create a new migration file
npm run db:migrate
# This will prompt you to name the migration
```

### Production Deployment

For production deployments, always use:

```bash
# 1. Deploy migrations
npm run db:migrate:deploy

# 2. Seed initial data (if needed)
npm run db:seed
```

### Troubleshooting

#### Migration Issues

```bash
# Check migration status
npm run db:migrate:status

# Reset if needed (WARNING: This will delete all data)
npm run db:migrate:reset
```

#### Schema Sync Issues

```bash
# Force push schema changes (development only)
npm run db:push --force-reset
```

## 🎯 Future Enhancements

- [ ] **Advanced Analytics**: Charts and graphs for land data
- [ ] **File Upload**: Property image uploads
- [ ] **Email Notifications**: Automated email alerts
- [ ] **Mobile App**: React Native mobile application
- [ ] **Advanced Search**: Elasticsearch integration
- [ ] **Reports**: PDF report generation
- [ ] **Multi-tenant**: Support for multiple brokers
- [ ] **API Documentation**: Swagger/OpenAPI documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is proprietary software for DB Vekariya Land Broker Services.

---

Built with ❤️ for DB Vekariya Land Broker Services
