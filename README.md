# Discover Albania

A modern, responsive tourism site. Browse destinations, submit tour reservations, and manage entries in a lightweight admin panel.
There’s no backend—data is stored locally in the browser (localStorage/sessionStorage)—making it ideal for a demo, portfolio, or a base for a future API.

## Features
- Clean UI with gradients and “glass” cards (Bootstrap 5, Poppins)
- Fully responsive (desktop/tablet/mobile)
- Reservation form with client-side validation and local min-date
- Admin panel: list/search/filter/sort reservations, export CSV
- Services manager: add/edit/delete services in a modal
- Accessibility basics (aria labels, image alts)

## Pages
- **index.html** — Hero + featured destinations
- **reservation.html** — Reservation form (persists to `da_reservations`)
- **admin.html** — Reservation dashboard (search/filter/sort/CSV export)
- **services.html** — Services CRUD (persists to `da_services`)

## Tech Stack
- HTML5, CSS (Bootstrap 5), Vanilla JavaScript
- localStorage / sessionStorage for in-browser persistence


## Suggested File Structure

