# Find My Family — Nepal Missing Persons & Family Reunification Platform

## Vision

A warm, human, trustworthy digital platform where families separated by Nepal's recurring flood disasters can report missing loved ones, search for them, and be reunited — built with elite design craft and deep respect for users in crisis.

## Context

Built in direct response to the Bhote Koshi flash flood (August 26, 2026) devastating Timure and Syabrubesi in Rasuwa district, Nepal. Third such flood on this river corridor in three years. Families currently have no single reliable place to report, search, or share information about missing persons.

## Target Users

- **Primary**: Frightened family members (often elderly, rural, low-literacy) on mid/low-range Android phones with cracked screens, small storage, and patchy 3G/4G
- **Secondary**: Volunteers and aid workers in the field
- **Tertiary**: Officials (Nepal Police, Nepal Red Cross, hospital staff) managing cases at scale

## Tech Stack

- **Frontend**: Next.js (React), PWA, mobile-first responsive
- **Backend**: RESTful API (Node.js)
- **Database**: PostgreSQL with PostGIS for geospatial
- **Matching Engine**: Fuzzy text matching (Levenshtein/phonetic for Nepali names) + basic photo-similarity signals
- **SMS**: Nepal-capable SMS gateway (Sparrow SMS abstracted behind clean interface)
- **Hosting**: Edge-cached (Cloudflare), optimized for 3G

## Milestone: v1.0 — MVP Launch

Target: Deployable within 72 hours for active disaster response.

## Project Code: FMF

## Working Directory: d:\software-main\findmyfamily
