---
name: frontend-instructions
description: Instructions taken into account when developing the frontend.
applyTo: '**/frontend/**/*'
---

# Frontend Copilot Instructions

Scope:
- Apply these rules to all files under application/frontend.
- Prioritize TypeScript, TSX, and styling changes.

Goals:
- Preserve existing architecture and conventions.
- Keep data flow fully typed end to end.
- Maintain responsive behavior on desktop and mobile.

## Architecture Rules

- Do not introduce React Router.
- Use the existing custom router in [application/frontend/src/components/Router.tsx](http://_vscodecontentref_/0).
- Keep app composition aligned with [application/frontend/src/App.tsx](http://_vscodecontentref_/1).
- Keep page shell and nav behavior aligned with [application/frontend/src/components/Layout.tsx](http://_vscodecontentref_/2).
- Place route pages in [application/frontend/src/pages](http://_vscodecontentref_/3).
- Centralize HTTP calls in [application/frontend/src/lib/api.ts](http://_vscodecontentref_/4).
- Keep shared frontend contracts in [application/frontend/src/types.ts](http://_vscodecontentref_/5).

## Type Safety Rules

- Preserve strict TypeScript quality.
- Avoid any unless there is a clear external boundary and no practical alternative.
- Add or extend interfaces in [application/frontend/src/types.ts](http://_vscodecontentref_/6) before wiring response data into UI.
- API helpers in [application/frontend/src/lib/api.ts](http://_vscodecontentref_/7) must have explicit typed inputs and outputs.

## Styling and UI Rules

- Follow existing Tailwind patterns and utility approach.
- Keep new UI consistent with the established visual language unless a redesign is explicitly requested.
- Ensure responsive behavior for common mobile and desktop widths.
- Prefer clear hierarchy, readable spacing, and meaningful motion over decorative effects.

## Implementation Patterns

Pattern: Add a new analytics widget
1. Add typed API method in [application/frontend/src/lib/api.ts](http://_vscodecontentref_/8).
2. Define data types in [application/frontend/src/types.ts](http://_vscodecontentref_/9).
3. Integrate in the target page under [application/frontend/src/pages](http://_vscodecontentref_/10) with loading, empty, and error states.
4. Keep layout behavior aligned with [application/frontend/src/components/Layout.tsx](http://_vscodecontentref_/11).

Pattern: Add a new page route
1. Create the page component under [application/frontend/src/pages](http://_vscodecontentref_/12).
2. Register route behavior through [application/frontend/src/components/Router.tsx](http://_vscodecontentref_/13).
3. Wire top-level usage from [application/frontend/src/App.tsx](http://_vscodecontentref_/14).
4. Add navigation in [application/frontend/src/components/Layout.tsx](http://_vscodecontentref_/15) if the page is user-discoverable.

## Hard Constraints

- No direct network calls in page components when [application/frontend/src/lib/api.ts](http://_vscodecontentref_/16) can be extended instead.
- No architectural rewrites unless explicitly requested.
- No untyped response mapping in UI components.

## Review Checklist

- Custom router usage remains intact.
- API access remains centralized.
- Types are explicit and shared.
- Loading and error states are present for async UI.
- Desktop and mobile layouts both work.

## Good Prompt Examples

- Add a new carrier trend card on analytics page using existing typed API layer and current router conventions.
- Refactor map page data loading to centralize all HTTP calls in api.ts with strict typing.
- Add a responsive filter panel on search page without changing global navigation behavior.
EOF