# EDW Mobile

EDW Mobile is a React Native CLI mobile app for the EDW internal tools platform. The current active module is **Finance**, which supports tracking accounts, bills, payments, reminders, and financial summary data through a custom backend API.

This app is built as a mobile client for an existing server/API and is intended to grow into a modular personal/internal operations app over time.

## Current Features

### Authentication

- Login with backend credentials
- JWT-based authentication
- Secure token storage using `react-native-keychain`
- Session restore on app launch using `/auth/me`
- Protected app navigation
- Sign out flow

### Navigation

- Root authenticated/unauthenticated navigation
- Drawer navigation for app-level sections
- Finance module navigation using bottom tabs
- Stack navigation for detail/create/edit screens

Current navigation structure:

```txt
RootNavigator
├── Login
└── AppDrawer
    ├── Home
    ├── Finance
    │   └── FinanceStack
    │       ├── FinanceTabs
    │       │   ├── Overview
    │       │   ├── Bills
    │       │   ├── Payments
    │       │   └── Accounts
    │       ├── BillDetails
    │       ├── CreateBill
    │       ├── EditBill
    │       ├── CreatePayment
    │       └── CreateAccount
    └── Settings
```

### Finance Module

#### Overview

- Account count and balance summary
- Active bill count
- Monthly bill total
- Recent payments
- Upcoming reminders

#### Accounts

- View accounts
- Create accounts
- Supports account types such as checking, savings, credit card, cash, and other

#### Bills

- View bills
- Create bills
- Edit bills
- View bill details
- Link bills to accounts
- Support frequency rules:
  - `monthly` requires `dueDayOfMonth`
  - `one-time`, `weekly`, `quarterly`, and `annual` require `dueDate`
- Native date picker support for due dates
- Reusable select/dropdown component
- Shared bill form logic for create/edit flows

#### Payments

- View payments
- Record a payment from a bill detail screen
- Payments are linked to bills and accounts

## Tech Stack

- React Native CLI
- TypeScript
- React Navigation
  - Native Stack
  - Drawer Navigator
  - Bottom Tabs
- TanStack Query
- React Hook Form
- Zod
- React Native Keychain
- React Native Safe Area Context
- React Native Gesture Handler
- React Native Reanimated
- React Native Worklets
- React Native DateTimePicker
- Patch Package

## Project Structure

```txt
src/
  api/
    client.ts
    useAuthenticatedApi.ts

  auth/
    AuthProvider.tsx
    tokenStorage.ts

  components/
    AppButton.tsx
    AppCard.tsx
    AppSelect.tsx
    AppTextInput.tsx
    Screen.tsx

  modules/
    finance/
      api/
        accounts.api.ts
        bills.api.ts
        financeSummary.api.ts
        payments.api.ts

      components/
        AccountCard.tsx
        BillCard.tsx
        BillForm.tsx
        PaymentCard.tsx

      navigation/
        FinanceStack.tsx
        FinanceTabs.tsx

      screens/
        AccountsScreen.tsx
        BillDetailsScreen.tsx
        BillsScreen.tsx
        CreateAccountScreen.tsx
        CreateBillScreen.tsx
        CreatePaymentScreen.tsx
        EditBillScreen.tsx
        FinanceHomeScreen.tsx
        PaymentsScreen.tsx

      types/
        account.types.ts
        bill.types.ts
        financeSummary.types.ts
        payment.types.ts

  navigation/
    AppDrawer.tsx
    RootNavigator.tsx

  screens/
    HomeScreen.tsx
    LoginScreen.tsx
    SettingsScreen.tsx

  types/
    auth.types.ts

  utils/
    formatCurrency.ts
    formatDate.ts
```

## Environment Setup

This project uses environment configuration for the API base URL.

Create a local environment file from the example:

```bash
cp .env.example .env.development
```

Example `.env.example`:

```env
API_BASE_URL=https://your-api-url.example.com
```

For Android emulator development, the API URL may look like:

```env
API_BASE_URL=http://10.0.2.2:3000
```

For testing on a physical phone, use a reachable LAN or hosted API URL:

```env
API_BASE_URL=http://192.168.x.x:3000
```

Do not commit `.env`, `.env.development`, or `.env.production` files.

## Installation

Install dependencies:

```bash
npm install
```

If using iOS later:

```bash
cd ios
pod install
cd ..
```

Start Metro:

```bash
npm start
```

Run Android:

```bash
npm run android
```

Run iOS:

```bash
npm run ios
```

## Android Notes

This project uses React Native Drawer Navigation, Reanimated, Gesture Handler, and Worklets.

Make sure `index.js` includes this as the first import:

```js
import 'react-native-gesture-handler';
```

If native dependencies change, clean and rebuild Android:

```bash
cd android
./gradlew clean
cd ..
npm run android
```

## Patch Package

This project may include a `patches/` folder for package fixes, such as drawer asset handling.

After installing dependencies, patches are applied automatically through:

```json
"postinstall": "patch-package"
```

The `patches/` folder should be committed.

## Security Notes

This repository should be safe for public GitHub only if secrets and private files are excluded.

Do not commit:

```txt
.env
.env.* except .env.example
*.apk
*.aab
*.keystore
*.jks
android/local.properties
Signing passwords
Backend JWT secrets
Database URLs
API private keys
Postman tokens
Real user passwords
```

The mobile app may include non-secret configuration such as an API base URL, but it should not include backend secrets. Anything bundled into a mobile app can potentially be inspected.

Runtime auth tokens are stored securely using `react-native-keychain`.

## Recommended `.gitignore` Entries

```gitignore
# Environment files
.env
.env.*
!.env.example

# Node
node_modules/

# Metro / React Native
.expo/
.bundle/
coverage/

# Android
android/.gradle/
android/app/build/
android/build/
android/local.properties
*.apk
*.aab

# Android signing keys
*.keystore
*.jks
android/app/*.keystore
android/app/*.jks

# iOS
ios/Pods/
ios/build/
*.xcworkspace/xcuserdata/
*.xcodeproj/xcuserdata/

# macOS
.DS_Store

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

## Public Repository Checklist

Before pushing to GitHub:

```bash
git status
git add .
git status
```

Carefully verify that none of these are staged:

```txt
.env
.env.development
.env.production
APK files
AAB files
Keystore/JKS files
local.properties
Signing credentials
Real API secrets
Backend secrets
```

Then commit:

```bash
git commit -m "Initial EDW Mobile app foundation"
```

## Future Improvements

Planned or likely next steps:

- Account details screen
- Edit account flow
- Payment details screen
- Payment method select/dropdown
- Better linked account display from backend joined responses
- Credit card/liability balance handling
- Delete/archive flows
- Finance reports
- Life Lessons module
- Cross-module Home dashboard
- Production/staging API environment handling

## Backend Expectations

The mobile app expects a backend API with endpoints similar to:

```txt
POST /auth/login
GET /auth/me
GET /finance/summary
GET /finance/accounts
POST /finance/accounts
GET /finance/bills
POST /finance/bills
GET /finance/bills/:billId
PATCH /finance/bills/:billId
GET /finance/payments
POST /finance/payments
```

The backend remains the source of truth for validation, authorization, and data integrity. Frontend validation is used for user experience and should not replace server-side validation.
