# 🦷 ENTNT Dental Center – React Dashboard Assignment

A fully responsive, modern dental management system built with **React**, featuring **simulated authentication**, **role-based dashboards**, **dark mode**, **file uploads**, and **PDF/chart export** — all without backend or external auth/data libraries.

---

## 🚀 Live Demo

🔗 [Deployed App (Netlify/Vercel)](https://your-deployed-link.com)  
📂 [GitHub Repository](https://github.com/yourusername/entnt-dental-dashboard)

---

## 📌 Features

### 👨‍⚕️ Admin
- Dashboard with stats (Revenue, Patients, Appointments)
- Real-time Notifications (audio & toast)
- Calendar (react-big-calendar)
- Patient list (search + CRUD)
- Incident management (appointments, treatments)
- File upload for X-rays, invoices
- Export revenue chart as PDF
- Fully responsive with hamburger menu and animated sidebar

### 🧑‍🤝‍🧑 Patient
- Personalized dashboard
- Treatment history (with cost, files, status)
- Appointment booking via landing form
- Profile section (email, role, patient ID)

### 🌙 Dark Mode
- Toggle between light/dark themes
- Auto-persisted via localStorage
- Works on every UI element (forms, tables, modals)

### 📁 File Uploads
- Upload & preview PDFs/images
- Auto memory cleanup using URL.revokeObjectURL
- View/download in treatment history

### 📊 Data Visualization
- Monthly revenue chart using Recharts
- Admin dashboard insights

### 📱 Mobile-First UX
- Responsive navbar + mobile menu
- Sidebar slide animation
- Mobile notifications

---

## 🔧 Tech Stack

| Feature            | Tech Used           |
|--------------------|---------------------|
| UI Framework       | React (Vite)        |
| Styling            | Tailwind CSS        |
| Routing            | React Router DOM    |
| State Management   | React Context API   |
| Animations         | Framer Motion       |
| Charts             | Recharts            |
| Calendar           | React Big Calendar  |
| Notifications      | React Hot Toast     |
| Icons              | Lucide              |
| Persistence        | localStorage        |
| Deployment         | Vercel / Netlify    |

---

## 📁 Folder Structure

```
src/
│
├── auth/        # AuthContext & ProtectedRoute
├── components/
│   ├── layout/  # Navbar, Sidebar, PageWrapper
│   ├── ui/      # Input, Button, Modal, Card, Table, FileUpload
│   └── ...      # Feature-specific components
├── context/     # AppContext (global state simulation)
├── pages/       # Dashboard, Login, Patients, Incidents, etc.
├── App.jsx      # Routes & routing logic
└── main.jsx     # App entry point
```

---

## ⚙️ Setup Instructions

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/entnt-dental-dashboard.git
cd entnt-dental-dashboard

# 2. Install dependencies
npm install

# 3. Run locally
npm run dev
```

---

## 👥 Simulated Login Credentials

| Role     | Email            | Password  |
|----------|------------------|-----------|
| Admin    | admin@entnt.in   | admin123  |
| Patient  | john@doe.com     | john123   |

> 🔒 No backend or API – Auth & data managed via Context API (in-memory).

---

## 📐 Architecture & State

- **AuthContext**: Simulates login, user session
- **AppContext**: Holds global state – patients, incidents, dashboard data
- **ProtectedRoute**: Wraps pages to restrict based on role
- **Dark Mode**: Controlled via localStorage + Tailwind dark class

---

📌 Technical Decisions
| Area                      | Decision
| ------------------------- | ---------------------------------------------------------------------------------------------------------|
| **State Management**      | Used **React Context API** (split into `AuthContext` and `AppContext`) instead of Redux/Zustand to align with the “no external libraries” constraint. State is modular, reactive, and avoids prop-drilling. |
| **Authentication**        | Auth is simulated with hardcoded users, managed in-memory and persisted in `localStorage` to maintain session even on refresh.                                                                              |
| **Data Persistence**      | No backend, so patient records, incidents, and appointments are all stored and updated in `localStorage`. Deep merges and ID management are done manually.                                                  |
| **Routing & Protection**  | Role-based access control is implemented using a custom `<ProtectedRoute>` wrapper. Unauthorized users are redirected with toast feedback.                                                                  |
| **Dark Mode**             | Managed through `localStorage` + Tailwind’s `dark` mode class toggled on the root `<html>`. Theme toggler uses framer-motion for smooth icon transition.                                                    |
| **Responsive Design**     | Layout is fully responsive: desktop sidebar is sticky and mobile sidebar slides in via `framer-motion`. Mobile hamburger is animated and toggles state across Navbar and Sidebar.                           |
| **Charts & Analytics**    | Chose **Recharts** for animated, interactive revenue visualization. Designed monthly revenue card to support export to PDF (via `html-to-image` + `jspdf`).                                                 |
| **Calendar UX**           | Used `react-big-calendar` with `date-fns` for intuitive appointment tracking. Events are color-coded by status, and custom `eventPropGetter` controls visual theming.                                       |
| **Notifications System**  | New incident triggers **toast alert + audio ping**. Read/unread tracking uses a unique `notificationId` array stored in localStorage.                                                                       |
| **File Upload & Preview** | Uploaded files are previewed using `URL.createObjectURL`, and memory is cleaned on unmount using `URL.revokeObjectURL` to prevent leaks.                                                                    |
| **UI Components**         | Reusable `Input`, `Button`, `Card`, `Table`, and `FileUpload` components live in a `/ui` folder to promote DRY design and fast customization.                                                               |
| **Accessibility**         | All components include ARIA labels and focus rings. Buttons, inputs, and links support keyboard navigation and screen reader roles.                                                                         |
| **Mobile Optimization**   | Navbar and Sidebar are context-aware. Mobile view shows slide-in nav, and even critical actions like Logout and Notifications are reachable on small screens.                                               |
| **Form UX**               | Used controlled components with clear validation states, inline error messages, and form animations for smoother interaction.                                                                               |
| **Toast Management**      | `react-hot-toast` is used for all feedback: login errors, booking success, logout, etc. The toast queue is kept short and uses consistent styling.                                                          |


---

## 🛠 Issues & Solutions

| Challenge | Solution |
|----------|----------|
| 🌗 **Dark Mode inconsistencies** across components | Initially, some form elements didn’t respond to dark mode. Solved by enforcing consistent Tailwind dark utility classes and toggling `document.documentElement.classList`. |
| 📱 **Mobile Sidebar stutter on animation** | On some devices, sidebar animation was choppy. Introduced `Framer Motion`'s `AnimatePresence` + `tween` transitions for smoother entry/exit. |
| 🔔 **Notification dropdown overlapping UI** | Notification panel would clip or overlap on small screens. Added z-index and relative parent with `max-height` + scroll to fix overflow issues. |
| 📅 **Calendar display misalignment** on certain dates | `react-big-calendar` sometimes rendered month view with offset. Fixed via custom styling + overriding default calendar padding/margin. |
| 📂 **Uploaded file preview not showing** | File preview failed when file was re-selected after deletion. Fixed by updating the `FileUpload` component to reset file input using `key` prop and revoking URLs properly. |
| 📉 **Chart PDF export cuts off axis labels** | The `recharts` canvas did not render properly in PDF. Used `html2canvas` + adjusted layout box model and width to preserve chart clarity in exports. |
| 🧪 **Date-time local input not defaulting correctly** | `min={new Date().toISOString()}` failed due to formatting. Fixed by slicing the string (`.slice(0,16)`) to match `datetime-local` input format. |
| 🧠 **Patient ID mapping missing** in notifications | Notifications showed "undefined" instead of patient name. Refactored `getPatientName()` utility to return fallback string like `Unknown`. |
| 🧾 **Toast re-triggered on every render** | Toasts fired multiple times due to stale state. Fixed with ref checks and triggering toasts only on fresh unread changes using useEffect dependencies. |
| 🔄 **Login redirect delay** | After login, components re-mounted before `user` was available. Solved with conditional rendering and redirect logic only after `user` is set in `AuthContext`. |
| 🧹 **Memory leak on image previews** | Browser memory usage increased after repeated file uploads. Handled it by calling `URL.revokeObjectURL()` inside cleanup `useEffect`. |
| 📋 **Repetitive styles** in form components | Multiple forms had repeated Tailwind utility classes. Abstracted reusable `Input`, `Button`, `Modal`, and `Card` components to keep code DRY. |
| ⚠️ **LocalStorage mismatch** during theme toggle | Theme flickered on initial load. Fixed by reading and applying theme in `useEffect()` at mount before UI renders. |
| 📐 **Overflow issues on smaller devices** | Some tables and charts broke layout. Fixed using Tailwind's `overflow-x-auto` and responsive `min-w` table settings. |

---

## ✨ Bonus Features

✅ Dark Mode with persistent theme toggle
✅ Toast + Sound Notifications with localStorage tracking
✅ PDF Export of Chart (Monthly Revenue)
✅ Fully Responsive Layout with mobile-first UX
✅ Animated Sidebar using Framer Motion
✅ Modular & Reusable UI Components (Card, Button, Input, Modal, FileUpload)
✅ Memory-safe File Uploads with automatic cleanup (URL.revokeObjectURL)
✅ Form with Simulated Appointment Booking (Landing Page)
✅ Landing Page with Smooth Scroll Navigation
✅ Real-Time Notifications with Audio Feedback
✅ Admin Dashboard with Chart + Stats + Export
✅ Realtime Patient Count & Revenue Calculation
✅ Framer Motion Hover & Tap Animation on Buttons
✅ Mobile Notification Dropdown with Scroll & Accessibility
✅ Clean Git Commit History (meaningful commits)
✅ Fallbacks for Broken Images (onError handlers)
✅ Role-Based Sidebar Navigation
✅ Simulated Patient ID Linking in Notifications
✅ Scroll Lock for Mobile Sidebar Menu
✅ Graceful Form Reset After Submission
✅ Custom Animated Buttons (hover, tap feedback)
✅ Auto-scroll to sections on nav click (#anchor smooth scroll)
✅ Minified DateTime inputs to match HTML5 format
✅ Dev-friendly logs (checks for missing section IDs on landing)
✅ Semantic HTML & Accessibility-Focused Labels
✅ Deployment-ready via Vercel or Netlify
✅ No Code Bloat – Tailwind utility classes and shared design system



---

## 📩 Submission Checklist

✅ Deployed App Link  
✅ GitHub Repo with Commit History  
✅ README with Setup, Features, Architecture, Issues  
✅ React + Router + Context API  
✅ Role-based Access (Admin / Patient)  
✅ UI: Tailwind CSS + Responsive + Animations  
✅ No backend / No external auth libs  
✅ File Upload + Notification + Charts

---

**Built with ❤️ for ENTNT Dental Assignment.**
