# Journal Review Simple System

## Project Overview

This project is a web-based journal/manuscript review workflow system built with **Laravel 13** and **Inertia.js + React (TypeScript)**. It is designed for student submission and reviewer/admin evaluation workflows.

Users can submit manuscripts with multiple files, track versions, and see review outcomes. Admin/reviewer users can review all submissions, update status, provide recommendations, download files, and manage student accounts.

## Key Capabilities

1. **Submission lifecycle management**: create submissions, upload revision files, and maintain submission history.
2. **Review status tracking**: manage statuses such as `under review`, `needs revision`, `accepted`, `rejected`, and `recommended for journal submission`.
3. **File handling**: download the latest submission file and historical files.
4. **Role-based access control**: admin-only pages and protected actions via middleware/policies and role permissions.
5. **User/student administration**: admin can view users and manage student accounts.
6. **Authentication & security**: login, email verification, profile/security settings, and Fortify-based security features.

## Tech Stack

- **Backend**: PHP 8.3, Laravel 13, Eloquent ORM
- **Frontend**: React 19, TypeScript, Inertia.js, Vite, Tailwind CSS 4
- **Authorization**: spatie/laravel-permission
- **Tooling**: ESLint, Prettier, Laravel Pint, PHPUnit

## Local Development

```bash
composer setup
composer dev
```

## Useful Commands

```bash
composer test
composer lint
npm run lint:check
npm run types:check
npm run build
```
