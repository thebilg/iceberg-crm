# Iceberg CRM – Frontend

## Overview

This repository contains the frontend application of the Iceberg CRM system.

It provides a user-friendly interface to manage properties, agents, and transactions, and to visualize the full transaction lifecycle and financial breakdown.

---

## Tech Stack

* Nuxt 3
* Pinia (State Management)
* Tailwind CSS

---

## Core Features

* Property management (table view)
* Agent overview (card view)
* Transaction tracking (kanban board)
* Stage transition actions
* Financial breakdown visualization
* API integration with backend services

---

## Pages

* `/properties` → Property listing & management
* `/agents` → Agent cards & overview
* `/sales` → Transaction lifecycle (kanban)
* `/` → redirect

---

## UI/UX Decisions

* Table view for properties (comparison-focused)
* Card layout for agents (person-centric)
* Kanban board for transactions (process tracking)

The kanban structure allows:

* Clear visibility of transaction stages
* Easy identification of bottlenecks
* Fast operational actions

---

## State Management

Pinia is used to:

* Store agents, properties, and transactions
* Handle API requests centrally
* Manage stage updates
* Provide fallback data in development

---

## API Integration

This frontend consumes the backend API:

👉 Backend Repository:
https://github.com/thebilg/iceberg-backend

Backend URL is configured from the frontend environment.

Create a `.env` file in the project root:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:8080
```

Nuxt exposes this value through `runtimeConfig.public.apiBase` and the API layer uses it as the base URL for backend requests.


---

## Running the Project

```bash
npm install
npm run dev
```

---

## Design Document

Full system design and architectural decisions:

👉 https://github.com/<your-username>/iceberg-crm-backend/blob/main/DESIGN.md

---

## Notes

* Frontend is a presentation layer
* All business logic lives in the backend
* UI reflects backend-driven state

---
