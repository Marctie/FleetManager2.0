# Guest Mode Implementation Guide

## Overview

The Fleet Management system now supports a **Guest Mode** that allows users to access the application without authentication, but with limited functionality.

## How to Access Guest Mode

1. Go to the login page
2. Click on the Fleet Management logo (the image at the top)
3. You will be redirected to the home page with guest access

## Features

### What Works in Guest Mode

- ✅ View the home dashboard
- ✅ Browse the application interface
- ✅ View vehicle lists (if implemented)
- ✅ View maps and general information
- ✅ Navigate between pages

### What's Limited in Guest Mode

- ❌ Cannot perform write operations (add, edit, delete)
- ❌ Cannot upload documents
- ❌ Cannot access admin features
- ❌ MQTT features might be restricted
- ❌ API calls that require authentication will fail

## Implementation Details

### AuthService Methods

```typescript
// Login as guest
authService.loginAsGuest(): void

// Check if user is in guest mode
authService.isGuestMode(): boolean
```

### How to Restrict Features for Guests

#### Example 1: Hide buttons for guests

```typescript
// In your component
export class MyComponent {
  private authService = inject(AuthService);
  isGuest = this.authService.isGuestMode();
}

// In your template
<button *ngIf="!isGuest" (click)="addVehicle()">
  Add Vehicle
</button>

<div *ngIf="isGuest" class="guest-notice">
  Login to add vehicles
</div>
```

#### Example 2: Disable buttons for guests

```typescript
// In your template
<button
  [disabled]="isGuest"
  [title]="isGuest ? 'Login required' : ''"
  (click)="deleteItem()">
  Delete
</button>
```

#### Example 3: Guard specific routes

```typescript
// In your routes configuration
{
  path: 'admin',
  component: AdminComponent,
  canActivate: [authGuard, roleGuard(['admin'])]
}
```

## Visual Indicators

### Guest Banner

When a user is in guest mode, a yellow banner appears on the home page:

- **Color**: Orange gradient
- **Message**: "You are browsing with limited access. Some features may be restricted."
- **Position**: Below the welcome message

### User Info Display

- **Username**: "Guest User"
- **Role**: "guest"
- **Email**: "guest@fleetmanagement.com"

## Logout Behavior

- Guest logout doesn't call the API
- Simply clears local storage
- Redirects to login page
- No confirmation dialog needed

## Security Considerations

### What's Protected

1. **Auth Guard**: Guests pass the `authGuard` but can be blocked by role-based guards
2. **API Calls**: Backend should validate tokens; guest mode has no token
3. **Write Operations**: Should be disabled in the UI and rejected by the backend
4. **Sensitive Data**: Should not be accessible without a real token

### What to Check

- ⚠️ Ensure backend validates all requests
- ⚠️ Don't expose sensitive data to guest users
- ⚠️ Implement role-based access control on the backend
- ⚠️ Test all API endpoints without authentication

## Customization

### Change Guest User Info

Edit `auth.service.ts`:

```typescript
loginAsGuest(): void {
  const guestUser: IUserInfo = {
    userId: 'guest',
    username: 'Your Custom Name',
    email: 'custom@email.com',
    role: 'guest',
  };
  // ...
}
```

### Change Banner Style

Edit the `.guest-banner` CSS in `home.ts`:

```css
.guest-banner {
  background: linear-gradient(135deg, #your-color-1, #your-color-2);
  /* other styles */
}
```

### Disable Guest Mode Entirely

Remove or comment out the guest login functionality:

1. Remove `(click)="loginAsGuest()"` from `login.ts`
2. Remove `loginAsGuest()` method from `LoginComponent`
3. Optional: Remove `isGuestMode()` check from `AuthService.isAuthenticated()`

## Best Practices

1. **Always check guest mode** before allowing write operations
2. **Show clear messages** to guests about limitations
3. **Provide login prompts** when guests try restricted features
4. **Test guest experience** regularly
5. **Keep guest data** separate from authenticated user data
6. **Don't trust guest mode** for security - validate on backend

## Example Implementation

### Vehicle List Component

```typescript
import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-vehicle-list',
  template: `
    <div class="header">
      <h2>Vehicle List</h2>
      <button *ngIf="!isGuest" (click)="addVehicle()">Add Vehicle</button>
      <div *ngIf="isGuest" class="guest-hint">Login to add or modify vehicles</div>
    </div>

    <div class="vehicle-list">
      <!-- Vehicle list items -->
      <div *ngFor="let vehicle of vehicles" class="vehicle-item">
        {{ vehicle.name }}
        <button *ngIf="!isGuest" (click)="editVehicle(vehicle)">Edit</button>
      </div>
    </div>
  `,
})
export class VehicleListComponent {
  private authService = inject(AuthService);
  isGuest = this.authService.isGuestMode();

  // Component logic...
}
```

## Troubleshooting

### Guest can't access any pages

- Check that `authGuard` includes `|| this.isGuestMode()` in the condition
- Verify localStorage has 'userRole' = 'guest'

### Guest can perform write operations

- Add `*ngIf="!isGuest"` to action buttons
- Implement backend validation

### Guest banner doesn't show

- Check that `isGuest` is properly set in component
- Verify template has `*ngIf="isGuest"` condition

### Logout doesn't work for guests

- Verify `isGuestMode()` check in `AuthService.logout()`
- Check that localStorage is being cleared

## Future Enhancements

- [ ] Add rate limiting for guest users
- [ ] Track guest analytics separately
- [ ] Add conversion prompts to encourage registration
- [ ] Implement temporary guest sessions with expiration
- [ ] Add guest activity logs
- [ ] Create dedicated guest homepage with limited features
