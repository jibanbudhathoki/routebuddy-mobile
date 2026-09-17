# RouteBuddy Architecture

RouteBuddy uses a feature-first structure. Code should live as close as
possible to the capability that owns it, while genuinely cross-feature code
belongs in `shared`.

```text
src/
  app/                  App composition and providers
  features/             Product capabilities
    home/
      components/       Home-only UI
      screens/          Screen-level composition
      hooks/            Home-only hooks
      services/         Home-only data access
      types.ts          Home-only types
  shared/
    components/         Reusable UI primitives
    hooks/               Reusable hooks without product knowledge
    lib/                 Platform and utility helpers
    services/            Shared API, storage, and analytics clients
    types/               Shared domain-independent types
  theme/                Global Unistyles themes and design tokens
```

## Shared vs reusable

- `shared/components` contains low-level pieces such as `AppScreen`, buttons,
  inputs, cards, and loading states. They should not know about trips, places,
  authentication, or navigation destinations.
- `features/*/components` contains reusable pieces inside one capability, such
  as `TripCard` or `PlaceResultRow`. They can use shared components and feature
  types, but should not be imported by another feature.
- `features/*/screens` composes the feature components into a route or screen.
- `app` wires providers, navigation, and the initial screen together. It should
  not contain feature-specific presentation logic.

## Dependency direction

```text
app -> features -> shared
app -> shared
```

Shared code must remain independent of features. When a component needs
feature-specific data, pass it through props or keep the component in that
feature instead of promoting it to `shared` prematurely.