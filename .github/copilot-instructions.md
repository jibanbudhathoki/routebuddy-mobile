# RouteBuddy Agent Instructions

These instructions apply to all work in this repository.

## Architecture

- Keep the project feature-first and maintain the existing structure:
  `src/app`, `src/features`, `src/shared`, and `src/theme`.
- Put app composition, providers, and navigation in `src/app`.
- Put product-specific screens, components, hooks, services, and types inside
  the owning folder under `src/features`.
- Put code in `src/shared` only when it is genuinely reusable by two or more
  features and has no feature-specific business knowledge.
- Keep shared components independent from feature folders. Shared code may not
  import from `src/features`.
- Keep screens focused on composition. Move reusable UI and business logic into
  components, hooks, or services.
- Keep folders clean. Do not add duplicate components, unused files, speculative
  abstractions, or barrel exports without a clear benefit.

## Components

- Before creating a UI component, search `src/shared/components` and the current
  feature's `components` folder for an existing reusable component.
- Reuse an existing shared component when it matches the behavior and visual
  purpose. Extend it through props when the behavior is genuinely general.
- Use feature components for domain-specific UI such as `TripCard`,
  `PlaceResultRow`, or `RouteSummary`.
- Prefer accessible React Native primitives and expose meaningful props such as
  `title`, `onPress`, `disabled`, `loading`, and accessibility labels where
  appropriate.
- Avoid hardcoding layout values repeatedly. Use theme spacing and radius
  tokens, and add a token when a value is part of the design system.

## Theme and styling

- Never hardcode colors in components or screens.
- Always use colors from the Unistyles theme, such as
  `theme.colors.primary`, `theme.colors.secondary`, `theme.colors.text`,
  `theme.colors.muted`, `theme.colors.surface`, and `theme.colors.border`.
- Use the primary color for primary actions and the secondary color for
  secondary actions. Do not invent one-off colors for individual components.
- Keep light and dark theme tokens aligned whenever a new token is added.
- Use theme spacing, radius, and typography tokens instead of scattered magic
  numbers.
- Keep styles close to the component that owns them and use
  `react-native-unistyles` consistently.
- Match the RouteBuddy visual language: navy primary actions, white surfaces,
  cool blue-gray supporting text, clear hierarchy, and restrained rounded
  corners.

## Expo and React Native

- This project uses Expo SDK 57. Read the exact versioned Expo documentation at
  `https://docs.expo.dev/versions/v57.0.0/` before changing Expo configuration,
  native modules, or SDK APIs.
- Use `npx expo install` for Expo packages so versions stay compatible with SDK
  57.
- Preserve the existing TypeScript and Unistyles setup unless the task requires
  a deliberate change.
- Validate changes with `npm exec tsc -- --noEmit` and run the narrowest relevant
  test or Expo check available.

## Before finishing

- Check that imports follow the dependency direction: `app -> features ->
  shared`.
- Confirm new UI uses shared components and theme tokens where applicable.
- Remove unused imports and temporary code.
- Do not modify unrelated files or native generated output.