# Tour Feature Architecture Map

## Purpose

This file documents the architecture, folder semantics, code style, and data flow of `src/features/tour`.

Goal: this document should be portable to another project so the same feature structure can be recreated with the same conventions:

- feature-first foldering
- custom hooks for query/mutation orchestration
- `@tanstack/react-query` as the client data layer
- explicit split between `ui`, `containers`, `hooks`, `api`, `routes`, `services`, `lib`, `model`, `domain`
- explicit public exports
- thin route handlers, thicker service layer
- data preparation and validation moved out of components

---

## Feature Tree

```text
src/features/tour
├── api/
│   └── tour-api.ts
├── assets/
│   └── styles.module.scss
├── constants/
│   └── default-create-data.ts
├── containers/
│   ├── create-tour-form.tsx
│   ├── edit-tour-form.tsx
│   └── tour-feature.tsx
├── hooks/
│   ├── use-create-tour.ts
│   ├── use-delete-tour.ts
│   ├── use-edit-tour.ts
│   └── use-tour-list.tsx
├── lib/
│   ├── prepare-data-utils.ts
│   ├── tour-search-params-utils.ts
│   ├── schemas/
│   │   └── create-tour-schemas.ts
│   └── typeguards/
│       └── create-tour-typeguard.ts
├── model/
│   └── create-tour.tsx
├── routes/
│   ├── tour/
│   │   ├── delete-tour.ts
│   │   ├── patch-tour.ts
│   │   └── post-tour.ts
│   ├── tours/
│   │   └── get-tours.ts
│   └── user/
│       └── get-user-tours.ts
├── services/
│   └── tour-service.ts
├── ui/
│   ├── link-button.tsx
│   ├── server-tour-card.tsx
│   ├── tour-card.tsx
│   └── tour-feature-list.tsx
├── domain.ts
├── index.ts
└── server.ts
```

---

## Folder Semantics

### `domain.ts`

Central feature-level types. This is the first place to look when you need to understand the data contract of the feature.

Contains:

- UI-facing entity types such as `TourCardEntity`
- create/edit payload types such as `DraftCreateTourData`, `CreateTourData`, `EditTourData`
- response contracts such as `GetToursResponse`

Rule:

- feature-specific types live here unless they are truly entity-global and belong to `entities/*`

### `api/`

Client transport layer.

Responsibilities:

- wrap `apiClient`
- define `baseKey` for react-query
- define transport methods for CRUD
- define query factory via `queryOptions`

Important file:

- `tour-api.ts`

Style:

- query key identity is owned by API layer
- client hooks do not build raw request URLs themselves
- list query option is exported as `getTourListQueryOption`

### `hooks/`

Custom hooks are the feature orchestration layer on the client.

Responsibilities:

- call `useQuery` / `useMutation`
- invalidate cache
- adapt form/dialog data to transport format
- return handlers or prepared UI fragments

Current hooks:

- `use-tour-list.tsx`: query + local pagination/search state + ready-to-render nodes (`tools`, `pagination`, `cursor`)
- `use-create-tour.ts`: mutation for creation, converts dialog data to `FormData`
- `use-edit-tour.ts`: mutation for edit, converts dialog data to `FormData`
- `use-delete-tour.ts`: mutation for delete by `id`

Pattern:

- hooks hide react-query details from components
- components mostly wire dialogs, buttons, and notifications

### `containers/`

Stateful client components that compose hooks, dialog state, schema, initial values, and side effects like toast notifications.

Current role split:

- `tour-feature.tsx` is the main reusable orchestrator for both create and edit flows
- `create-tour-form.tsx` is an older narrower wrapper for create only
- `edit-tour-form.tsx` looks legacy/incomplete and is not the canonical path now

Practical rule for reuse:

- prefer one container that can switch behavior by `type` when create/edit share the same form model

### `ui/`

Presentation and composition components.

Typical responsibilities:

- render cards/lists/buttons
- bind user action to hooks or container triggers
- avoid validation/transport logic

Current files:

- `tour-feature-list.tsx`: list rendering for fetched tours
- `tour-card.tsx`: admin/client card with edit/delete actions
- `server-tour-card.tsx`: server component card for public rendering
- `link-button.tsx`: tiny style wrapper around `next/link`

### `model/`

Form model definitions used by generic form systems.

Current file:

- `create-tour.tsx`

Contains:

- ordered list of form fields
- field types
- labels
- options
- required flags
- initial form state

Rule:

- form field declaration is extracted from components and kept declarative

### `lib/`

Pure helpers and feature-local infrastructure.

Current roles:

- `prepare-data-utils.ts`: transform dialog data to `FormData`, form data back to validated domain payload, and entity to edit form state
- `tour-search-params-utils.ts`: map URL params to Prisma query args
- `schemas/create-tour-schemas.ts`: zod schemas for create/edit/patch flows
- `typeguards/create-tour-typeguard.ts`: typeguard built on top of zod schema

Rule:

- if logic is not UI, not transport, and not business service, it likely belongs in `lib`

### `services/`

Server-side business and persistence orchestration layer.

Current file:

- `tour-service.ts`

Responsibilities:

- talk to repositories
- shape Prisma queries
- calculate pagination
- convert repository results to feature/entity models
- return `Either` where failure is meaningful

Rule:

- route handlers should delegate business logic here

### `routes/`

Thin server handlers grouped by endpoint family.

Current groups:

- `routes/tour/*`: create, update, delete for a single tour resource
- `routes/tours/*`: list routes
- `routes/user/*`: user-scoped list route

Responsibilities:

- read request data
- verify session / permissions
- validate payload via feature utils
- call service layer
- map result to HTTP response helpers

### `index.ts`

Public client-facing feature API.

Current exports:

- create function
- main container default export
- selected domain types
- schemas
- selected UI components

Rule:

- only export the intended public surface here
- importing from `@/features/tour` should feel like using the feature as a module

### `server.ts`

Public server-facing entrypoint for server consumers.

Current exports:

- route handlers
- service
- server UI component

Rule:

- if something is server-only and meant for external usage, re-export it here instead of `index.ts`

---

## Real Data Flow

### 1. List Flow

`TourFeatureList` -> `useTourList` -> `tourApi.getTourListQueryOption` -> `apiClient.get` -> `/tours/user` route -> `getTours` route -> `tourSearchParamsUtils` -> `tourService.getUserTours` -> repositories

Conventions visible in this flow:

- list hook owns page/search local state
- API layer owns query key and query factory
- route handler is thin
- service owns pagination/count/business shaping
- UI receives already-shaped data

### 2. Create Flow

`TourFeature(type='create')` -> `FormDialog` submit -> `useCreateTour` -> `prepareDataUtils.prepareDataToCreate` -> `tourApi.createTour` -> `postTour` route -> `prepareDataUtils.getTourData` -> `tourService.createTour`

Conventions:

- component does not assemble `FormData`
- hook converts generic dialog data into request payload
- route re-validates payload
- file/image handling is kept out of components
- successful mutation invalidates `[tourApi.baseKey]`

### 3. Edit Flow

`TourFeature(type='edit')` -> `prepareDataUtils.prepareDataToEdit` -> `FormDialog` submit -> `useEditTour` -> `tourApi.editTour` -> `patchTour` route -> `prepareDataUtils.getEditTourData` -> `tourService.updateTour`

Conventions:

- edit initial data is prepared asynchronously
- one form model is reused between create and edit
- edit path passes `id` and `authorId`
- patch path accepts partial data but still requires identity/permission fields

### 4. Delete Flow

`TourCard` -> `useDeleteTour` -> `tourApi.deleteTour` -> `deleteTour` route -> repository delete

Conventions:

- delete hook is intentionally small
- cache invalidation still happens in the hook
- permission enforcement is server-side only

### 5. Public Server Card Flow

external server page/component -> `ServerTourCard` -> feature/entity UI building blocks

Conventions:

- feature may expose both client admin UI and server public UI
- server-specific presentation is separated from client CRUD UI

---

## React Query Style

This feature uses a repeatable react-query pattern.

### Query pattern

1. Define `baseKey` in `api/*`.
2. Create a query factory with `queryOptions`.
3. In hook, call `useQuery({ ...api.getXQueryOption(params) })`.
4. Keep local paging/filter state inside the feature hook.

Example pattern:

```ts
const baseKey = 'tours';

const getTourListQueryOption = ({ page, search }: { page: number; search: string }) =>
  queryOptions({
    queryKey: [baseKey, { page, search }],
    queryFn: ({ signal }) => getTours<GetToursResponse>({ signal, page, search })
  });
```

### Mutation pattern

1. Hook owns `useMutation`.
2. Hook invalidates `queryClient.invalidateQueries({ queryKey: [api.baseKey] })`.
3. Hook accepts optional lifecycle callbacks.
4. Hook adapts view-model data to transport payload before calling `mutate`.

Example shape:

```ts
const { mutate } = useMutation({
  mutationFn: tourApi.createTour,
  onSuccess: either => {
    if (either.type === 'left') throw new Error('...');
    queryClient.invalidateQueries({ queryKey: [tourApi.baseKey] });
    props?.onSuccess?.();
  },
  onError: error => props?.onError?.(error)
});
```

### Important local rule

- invalidate by base key, not by duplicating full list keys in every component

---

## Component Style

### Containers vs UI

The feature clearly trends toward this split:

- `containers/*`: modal open state, hook wiring, toast handling, schema wiring, initial data preparation
- `ui/*`: visual rendering and user interaction surfaces

Good canonical example:

- `containers/tour-feature.tsx`

It centralizes:

- create/edit mode branching
- dialog title/trigger
- schema selection
- initial data
- success/error handling
- hook selection

### Hooks may return UI fragments

`useTourList` returns:

- `tools`
- `pagination`
- `cursor`

This is a deliberate local style choice. The hook is not only data-oriented; it also packages repeated list controls. If you reproduce the architecture elsewhere, keep this only if the project prefers feature hooks that return composed render fragments.

If you want a stricter separation in a new project, the safer variation is:

- hook returns state + callbacks
- UI component renders controls itself

But for this codebase, returning `ReactNode` from a feature hook is part of the current style.

---

## Validation Style

Validation is layered.

### UI schema

`createTourSchemas`

Purpose:

- validate dialog/form state on the client side
- `mainPhoto` is represented as `File[]` because the form dialog field for files yields arrays

### Transport/domain schema

`createTourSchema`

Purpose:

- validate already-prepared create payload
- `mainPhoto` is a single `File`

### Edit schemas

- `editTourSchema`: mixed representation for existing photos and newly uploaded files
- `patchTourSchema`: partial patch payload with required identity fields
- `preparedPatchTourSchema`: prepared server-side photo entity shape

Rule:

- keep UI form representation and transport representation as separate schemas when they differ

---

## Data Preparation Style

`prepare-data-utils.ts` is one of the most important files in the feature.

It contains the feature's data adaptation boundary.

### Responsibilities

- convert dialog output into `FormData`
- normalize strings to numbers
- parse JSON-encoded arrays from `FormData`
- reconstruct arrays of uploaded files from flattened `file_1`, `file_2`, ...
- prepare entity data for edit mode back into `FormDialog` format

Rule:

- components and route handlers should not manually parse raw `FormData`

Why this matters:

- UI form contracts are rarely identical to transport contracts
- edit mode often needs reverse transformation
- file fields are the first thing that becomes messy if this logic stays in components

---

## Import Style

Observed import order in this feature:

1. external packages
2. feature-local imports via `@/features/...`
3. entity imports via `@/entities/...`
4. shared imports via `@/shared/...`
5. relative imports only when local proximity is clearer than absolute alias

Example shape:

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { tourApi } from '@/features/tour/api/tour-api';
import { prepareDataUtils } from '@/features/tour/lib/prepare-data-utils';

import { FormDialogDomain } from '@/entities/form-dialog';

import { Either } from '@/shared/lib/either';
```

Conventions:

- use absolute alias `@/` for cross-folder imports
- feature may import itself by absolute path
- relative imports are mostly used for very nearby files inside the same feature

---

## Export Style

### Public exports

Client/public feature exports are curated in `index.ts`.

Style:

- explicit named exports
- selective re-exports of types and schemas
- default export only for the main feature container

Current example:

```ts
export { CreateTourForm } from '@/features/tour/containers/create-tour-form';
export { TourFeature as default } from '@/features/tour/containers/tour-feature';
export type { TourCardEntity } from '@/features/tour/domain';
export * as TourFeatureDomain from '@/features/tour/domain';
```

### Server exports

Server-only surface is curated in `server.ts`.

Rule:

- separate public client API from public server API

---

## Naming Style

Observed naming rules:

- hooks: `use-*.ts` or `use-*.tsx`
- services: singular `*-service.ts`
- API files: singular `*-api.ts`
- route files: verb + resource, for example `post-tour.ts`, `patch-tour.ts`
- model files: noun or use-case specific, for example `create-tour.tsx`
- schemas: grouped in `lib/schemas/*`
- utility aggregators end with `Utils`

Names inside files:

- `baseKey` for react-query cache root
- `baseUrl` for API endpoint root
- `onSuccess`, `onError`, `onSettled` for lifecycle callbacks
- `initialCreateTourFormData` for initial form state

---

## Architectural Rules Worth Repeating In Another Project

If you want to recreate this style, preserve these rules:

1. One feature owns its entire vertical slice: UI, hooks, API, routes, service, schemas, helpers.
2. `domain.ts` is the feature contract center.
3. `index.ts` is the only public client entry.
4. `server.ts` is the only public server entry.
5. `api/*` owns transport methods and react-query query factories.
6. `hooks/*` owns `useQuery`, `useMutation`, cache invalidation, and transport adaptation.
7. `containers/*` owns modal state, toasts, schema selection, and orchestrates hooks.
8. `ui/*` stays mostly presentation-focused.
9. `model/*` stores declarative form config and initial values.
10. `lib/*` holds validation and data transformers.
11. `routes/*` should validate, check auth, call service, and return standardized responses.
12. `services/*` should talk to repositories and convert raw DB output into stable feature/entity contracts.

---

## Recommended Scaffold For Reuse

Use this as the default skeleton for a new CRUD feature modeled after `tour`:

```text
src/features/<feature-name>
├── api/
│   └── <feature>-api.ts
├── constants/
│   └── default-create-data.ts
├── containers/
│   └── <feature>-feature.tsx
├── hooks/
│   ├── use-<feature>-list.tsx
│   ├── use-create-<feature>.ts
│   ├── use-edit-<feature>.ts
│   └── use-delete-<feature>.ts
├── lib/
│   ├── prepare-data-utils.ts
│   ├── <feature>-search-params-utils.ts
│   └── schemas/
│       └── create-<feature>-schemas.ts
├── model/
│   └── create-<feature>.tsx
├── routes/
│   ├── <feature>/
│   │   ├── delete-<feature>.ts
│   │   ├── patch-<feature>.ts
│   │   └── post-<feature>.ts
│   └── <feature>s/
│       └── get-<feature>s.ts
├── services/
│   └── <feature>-service.ts
├── ui/
│   ├── <feature>-card.tsx
│   └── <feature>-feature-list.tsx
├── domain.ts
├── index.ts
└── server.ts
```

---

## Reproduction Checklist

When rebuilding this architecture in another project, check that:

- there is one `baseKey` per feature API
- all list queries are created in `api/*` with `queryOptions`
- all create/edit/delete hooks invalidate by `[baseKey]`
- form schemas are separated from transport schemas when needed
- `FormData` packing/unpacking is centralized in `prepare-data-utils`
- route handlers do not contain repository logic
- service layer converts DB records into stable entities
- feature exports are curated through `index.ts` and `server.ts`
- components do not hand-roll permission, parsing, or mutation transport logic

---

## Current Feature-Specific Notes

These are important if you want to reproduce the architecture faithfully, not idealize it.

### Canonical pieces

The most representative files for the architecture are:

- `index.ts`
- `server.ts`
- `domain.ts`
- `api/tour-api.ts`
- `hooks/use-tour-list.tsx`
- `hooks/use-create-tour.ts`
- `hooks/use-edit-tour.ts`
- `hooks/use-delete-tour.ts`
- `containers/tour-feature.tsx`
- `lib/prepare-data-utils.ts`
- `lib/schemas/create-tour-schemas.ts`
- `services/tour-service.ts`
- `routes/tour/post-tour.ts`
- `routes/tour/patch-tour.ts`
- `routes/tour/delete-tour.ts`
- `routes/tours/get-tours.ts`

### Non-canonical or legacy-looking pieces

- `containers/create-tour-form.tsx` is narrower than `tour-feature.tsx` and duplicates part of the create flow.
- `containers/edit-tour-form.tsx` appears outdated: it uses `useCreateTour` and create schema/model instead of a dedicated edit path.
- `assets/styles.module.scss` is currently not part of the main architectural story.

If you reproduce the feature elsewhere, treat `tour-feature.tsx` as the canonical container, not `edit-tour-form.tsx`.

### Style quirks to preserve only intentionally

- hooks returning `ReactNode` fragments
- use of `Either` in both API and service layers
- feature importing itself through `@/features/tour`
- mixed use of `@bem-react/classname` and other shared `cn` helpers

These are part of the real codebase style, but not all of them are mandatory best practice.

---

## Short Rule Set For "Do The Same Architecture Again"

If this file is later reused as instructions for another codebase, the shortest accurate directive is:

Build the feature as a full vertical slice under `src/features/<name>`. Put contracts in `domain.ts`, public exports in `index.ts` and `server.ts`, transport in `api/*`, client orchestration in custom hooks, modal/form orchestration in `containers/*`, presentational rendering in `ui/*`, schema and payload transforms in `lib/*`, declarative form config in `model/*`, thin HTTP handlers in `routes/*`, and business/database orchestration in `services/*`. Use `react-query` with a feature `baseKey`, query factories in the API layer, and cache invalidation in mutation hooks. Keep components free from payload assembly, validation internals, and repository access.

