# Shiloh College LMS

Shiloh College is a React-based learning management system for students, teachers, and administrators. It provides role-based dashboards, course enrollment, assignments, quizzes, reports, events, payments, notifications, and account settings.

## Technology Stack

- **React 18** with functional components and hooks
- **Create React App / react-scripts 5** for development and production builds
- **React Router 6** for client-side routing and protected routes
- **Material UI 6** for accessible interface components and theming
- **Emotion** for Material UI styling
- **Custom CSS** for design tokens, responsive layouts, dashboard visuals, and landing pages
- **Formik and Yup** for form state and validation
- **Axios and Fetch API** for backend requests
- **Chart.js and react-chartjs-2** for reports, attendance, finance, and progress charts
- **FullCalendar** for calendar and timetable experiences
- **notistack** for toast notifications
- **React Icons and MUI Icons** for interface icons
- **PayPal React SDK and Stripe SDKs** for payment integrations
- **JWT tokens** stored in browser storage for authenticated sessions

## Quick Start

### Requirements

- Node.js 18 or newer
- npm
- Access to the Shiloh backend for live API features

### Install

```bash
npm install
```

### Start development server

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```powershell
npm.cmd start
```

The app opens at [http://localhost:3000](http://localhost:3000). If that port is busy, Create React App will offer an alternate port.

### Create production build

```bash
npm.cmd run build
```

### Run tests

```bash
npm.cmd test
```

## Main Routes

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Public landing page | Public |
| `/home` | Public product and learning overview | Public |
| `/login` | Login and local demo access | Public |
| `/signup` | Account registration | Public |
| `/student/registration` | Student registration | Public |
| `/enrollment` | Course enrollment | Student |
| `/student` | Student dashboard and learning tools | Student |
| `/teacher` | Teacher dashboard and teaching tools | Teacher |
| `/admin` | Administration dashboard and operations | Admin |

## Demo Accounts

Open `/login` and select one of the demo actions. Demo data is stored locally and does not call the backend.

- **Student demo**: dashboard, courses, assignments, quizzes, classmates, report, calendar, events, payments, notifications, and settings
- **Teacher demo**: dashboard, courses, student list, grading, attendance, notifications, settings, and logout
- **Admin demo**: dashboard, users, transactions, finance, calendar, notifications, and logout

Demo fixtures are defined in `src/demoData.js` and use the `demo: true` flag. Real authenticated sessions continue to use the configured backend APIs.

## Project Structure

```text
src/
  App.js                         Application theme and routes
  App.css                        Shared layout and visual styles
  index.css                      Global tokens, typography, and accessibility styles
  demoData.js                    Local demo users and feature fixtures
  api.js                         API helpers
  components/
    context/                     Authentication and theme providers
    students/                    Student dashboard and learning tools
    teacher/                     Teacher dashboard and tools
    admin/                       Admin dashboard and operations tools
    Login.js                     Login and demo entry points
    Signup.js                    Account creation
    Navbar.js                    Public and role-based navigation
  pages/
    Home.js                      Product/home experience
    Admin.js                     Admin shell
    enrollment/                  Enrollment flow
```

## Authentication and Roles

Authentication is provided by `AuthContext` and uses the following browser storage values:

- `access_token`: active access token
- `refresh_token`: refresh token
- `user`: lightweight authenticated identity used by route guards
- `userDATA`: backend response and role-specific dashboard data

Protected routes check the authenticated user role before rendering student, teacher, or admin areas. Logout clears the active authentication data and returns the user to `/login`.

## UI and Design System

The interface uses a shared visual system defined in `src/App.js`, `src/index.css`, and `src/App.css`:

- Primary indigo for navigation and focus actions
- Coral for secondary actions and attention states
- Mint for success and positive progress
- Responsive layouts for desktop, tablet, and mobile
- Visible keyboard focus states
- Reduced-motion support through `prefers-reduced-motion`
- Skeleton, empty, error, progress, and achievement states

## Backend Configuration

Most live requests currently target the Shiloh backend hosted at:

```text
https://shiloh-server-2t51.onrender.com
```

Before using live workflows, verify that the backend is available and that the required authentication, enrollment, finance, calendar, quiz, and notification endpoints are configured.

## Troubleshooting

### `npm` is blocked in PowerShell

Use the Windows command shim:

```powershell
npm.cmd start
```

### Missing or corrupted dependency files

Reinstall dependencies:

```powershell
Remove-Item -Recurse -Force node_modules
npm.cmd install
```

### Port already in use

Stop the existing development server or accept the alternate port suggested by Create React App.

### Demo data does not appear

Use the demo buttons on `/login`. Demo data is loaded into `localStorage` and can be reset by logging out or clearing browser storage for the site.
