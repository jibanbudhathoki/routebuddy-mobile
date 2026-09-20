---
trigger: always_on
---

# Route Buddy Mobile - Agent Instructions

These instructions apply to all work in this repository and will be automatically loaded into the agent's context for every prompt. Always follow these rules.

## 1. Architecture
- Keep the project feature-first and maintain the existing structure: `src/app`, `src/features`, `src/shared`, and `src/theme`.
- Put app composition, providers, and navigation in `src/app`.
- Put product-specific screens, components, hooks, services, and types inside the owning folder under `src/features`.
- Put code in `src/shared` only when it is genuinely reusable by two or more features and has no feature-specific business knowledge.
- Keep shared components independent from feature folders. Shared code may not import from `src/features`.
- Keep screens focused on composition. Move reusable UI and business logic into components, hooks, or services.
- Keep folders clean. Do not add duplicate components, unused files, speculative abstractions, or barrel exports without a clear benefit.

## 2. Components
- Before creating a UI component, search `src/shared/components` and the current feature's `components` folder for an existing reusable component.
- Reuse an existing shared component when it matches the behavior and visual purpose. Extend it through props when the behavior is genuinely general.
- Prefer accessible React Native primitives and expose meaningful props such as `title`, `onPress`, `disabled`, `loading`, and accessibility labels where appropriate.
- Avoid hardcoding layout values repeatedly. Use theme spacing and radius tokens, and add a token when a value is part of the design system.

## 3. Theme and styling
- **CRITICAL: NEVER hardcode hex colors (e.g., `#FFFFFF`, `#000000`) in any components or screens.**
- Always use the `useUnistyles()` hook from `react-native-unistyles` to access colors dynamically via `theme.colors` (e.g., `theme.colors.primary`, `theme.colors.surface`, `theme.colors.muted`, etc.). 
- Keep styles close to the component that owns them and use `react-native-unistyles` consistently. Extract styles to a `StyleSheet.create((theme) => ({...}))` block at the bottom of the file.
- Match the RouteBuddy visual language: navy primary actions, white surfaces, cool blue-gray supporting text, clear hierarchy, and restrained rounded corners.

## 4. Data Validation, API & Storage
- Use **Zod** for all schema validation (forms, API responses, etc.). Place validation schemas in `src/features/[feature]/validations/`.
- All API calls must go through the wrapper `apiRequest` in `src/shared/api/apiClient.ts`.
- When dealing with tokens and user sessions, strictly use the helper functions in `src/features/auth/services/authStorage.ts` (which utilizes `expo-secure-store`).
- Always gracefully handle missing payload data to prevent crashes (e.g., provide fallbacks for `undefined` or `null` values in API responses).

## 5. Expo and React Native
- We use **React Navigation** (`@react-navigation/native` and `@react-navigation/bottom-tabs`). Ensure new screens are wired correctly.
- Handle safe areas dynamically using `useSafeAreaInsets()` from `react-native-safe-area-context` instead of hardcoded padding.
- This project uses Expo SDK 57. Read the exact versioned Expo documentation at `https://docs.expo.dev/versions/v57.0.0/` before changing Expo configuration, native modules, or SDK APIs.
- Use `npx expo install` for Expo packages so versions stay compatible with SDK 57.

## 6. Before finishing
- Check that imports follow the dependency direction: `app -> features -> shared`.
- Confirm new UI uses shared components and theme tokens where applicable.
- Remove unused imports and temporary code.
- Do not modify unrelated files or native generated output.
