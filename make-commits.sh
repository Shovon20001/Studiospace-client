#!/usr/bin/env bash
# Run once inside the client repo (after `git init`) to create 16 meaningful commits using YOUR git identity.
set -e
c() { git add "${@:2}" 2>/dev/null || true; git commit -q -m "$1" || true; }
c "chore: scaffold Next.js app with Tailwind and daisyUI" package.json next.config.mjs postcss.config.js tailwind.config.js jsconfig.json .gitignore .env.example
c "feat: add light and dark studio themes with global styles" src/app/globals.css src/components/ThemeToggle.js
c "feat: add root layout, fonts and providers" src/app/layout.js src/components/Providers.js
c "feat: add logo, sticky navbar with active route and profile dropdown" src/components/Logo.js src/components/Navbar.js
c "feat: add footer with newsletter, categories and X social link" src/components/Footer.js
c "feat: set up BetterAuth with MongoDB adapter and auth client" src/lib/auth.js src/lib/auth-client.js "src/app/api/auth"
c "feat: issue JWT in HTTPOnly cookie and add API proxy helper" src/app/api/token src/lib/api.js src/lib/constants.js
c "feat: add private route middleware and RequireAuth guard" src/middleware.js src/components/RequireAuth.js
c "feat: build login and registration with password validation and Google" src/app/login src/app/register
c "feat: add shared UI (modal, skeletons, spinner, empty state, ratings)" src/components/Modal.js src/components/Skeletons.js src/components/Spinner.js src/components/EmptyState.js src/components/Rating.js src/components/SafeImg.js src/app/loading.js
c "feat: add hero slider, studio card and home page sections" src/components/HeroSlider.js src/components/StudioCard.js src/app/page.js
c "feat: add explore studios page with search, filters and pagination" src/app/studios/page.js src/app/studios/ExploreClient.js
c "feat: add studio details page with gallery, reviews and host info" "src/app/studios/[id]"
c "feat: add studio form, add-studio and edit pages" src/components/StudioForm.js src/app/add-studio "src/app/studios/edit"
c "feat: add my listings with delete confirmation modal" src/app/my-listings
c "feat: add booking modal with live availability and My Bookings with host actions" src/components/BookingModal.js src/app/my-bookings
c "feat: add dashboard, wishlist and PDF invoice" src/app/dashboard src/app/wishlist src/lib/invoice.js
c "feat: add how-it-works, about and custom 404 pages" src/app/how-it-works src/app/about src/app/not-found.js
c "docs: add README, demo user script" README.md scripts
git add -A && git commit -q -m "chore: final polish" || true
git log --oneline | wc -l
