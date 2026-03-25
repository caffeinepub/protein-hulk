# Protein Hulk

## Current State
Full 7-screen mobile app prototype (Home, Menu, Goal, Target, Matching, Checkout, Map, Success). App.tsx is ~2254 lines. Screen type union currently: `home | menu | goal | target | matching | checkout | success | map`. The Menu page already has a Settings icon in the header (not wired). Bottom bar shows cart items but is not tappable. No auth system exists. No settings flow exists.

## Requested Changes (Diff)

### Add
- **Session-based auth state**: Register stores `{ fullName, email, password }` in React state (in-memory). Sign in validates against stored users. Demo account pre-seeded: `demo@protein.com` / `1234` (name: Demo User).
- **Authenticated user state**: `currentUser: { fullName, email } | null` lifted to App level.
- **New screens**: `settings | signin | forgotpassword | register | aboutus | reportbug | reviewrating` — add all to the Screen union.
- **Settings page**: Title "SETTINGS", back arrow to menu. 4 options in rounded rows (in order): Sign In / Register, About Us, Report a Bug, Review & Rating.
- **Sign In page**: Title "SIGN IN". Fields: Email/Username, Password. Checkbox: Remember Me. Button: SIGN IN (black rounded). Links below: Forgot Password, Register. On success → navigate to menu and set currentUser. On fail → show "Invalid email or password" inline error.
- **Forgot Password page**: Title "FORGOT PASSWORD". Instruction text. Email field. Button: SEND RESET EMAIL. Always shows success message: "A password reset email has been sent to your registered email address".
- **Register page**: Title "REGISTER". Fields: Full Name, Username (Email), Password, Confirm Password. Button: REGISTER. On success show "You have successfully registered on the PROTEIN HULK app", then navigate to menu and set currentUser.
- **About Us page**: Title "ABOUT US". Short paragraph about Protein Hulk as a smart drink vending app.
- **Report a Bug page**: Title "REPORT A BUG". Fields: Subject, Description. Button: SUBMIT. Helper text: "Tell us what went wrong and we will fix it".
- **Review & Rating page**: Title "REVIEW & RATING". 5-star selector, optional comment field, Button: SUBMIT REVIEW.
- **Welcome message on Menu**: If `currentUser` is set, show "Welcome, [FirstName]" at the top of the Menu page (first name extracted from fullName).
- **Cart bottom sheet**: New `CartSheet` component that slides up from bottom. Shows all cart items with drink image, name, kcal, sugar %, quantity, price. Each item has +/- quantity controls and a delete button. Bottom actions: Back to Menu, Checkout, Clear Cart (with confirmation). Dismiss by tapping backdrop or completing an action.
- **Tappable bottom bar**: On Menu and Matching screens, clicking the bottom bar opens the CartSheet.

### Modify
- **MenuScreen**: Wire the existing Settings icon button to navigate to `settings`. Pass `currentUser` prop to show welcome message. Make the bottom bar `onClick` open the cart bottom sheet.
- **MatchingScreen**: Make bottom bar `onClick` open the cart bottom sheet.
- **App state**: Add `currentUser`, `registeredUsers` state. Pass down as needed.
- **Screen union type**: Extend with new screen names.

### Remove
- Nothing removed.

## Implementation Plan
1. Extend the `Screen` type union with all new screen names.
2. Add `currentUser` and `registeredUsers` state to App, with demo account pre-seeded.
3. Pass `currentUser`, `onLogin`, `onRegister` props through App's screen renderer.
4. Wire the Settings icon in MenuScreen to `onNavigate("settings")`.
5. Add welcome message to MenuScreen header when `currentUser` is set.
6. Build CartSheet component (bottom sheet, AnimatePresence, shows items, qty controls, delete, 3 actions).
7. Make bottom bar in MenuScreen and MatchingScreen tappable to open CartSheet.
8. Build SettingsScreen component.
9. Build SignInScreen (validate against registeredUsers).
10. Build ForgotPasswordScreen.
11. Build RegisterScreen (stores user, shows success, navigates to menu).
12. Build AboutUsScreen.
13. Build ReportBugScreen.
14. Build ReviewRatingScreen.
15. Wire all screens in the main App screen router.
16. Maintain existing design: cream background `#F5EDD8`, green `#3F8F57`, dark green `#1F3D2B`, rounded UI, FruitBanner on top-level screens.
