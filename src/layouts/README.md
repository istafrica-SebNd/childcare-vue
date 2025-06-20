# 🎛️ Layout System

A clean, reusable layout system for the Oslo Kindergarten Vue application that provides consistent UI components with role-based dynamic navigation.

## 🎯 Overview

This system provides:
- **Reusable Layout Components**: Same BaseLayout, AppSidebar, AppHeader everywhere
- **Role-Based Dynamic Navigation**: Navigation content changes based on user permissions
- **Consistent UI**: Same visual design and behavior across all user roles
- **Developer-Friendly**: Simple, standard Vue patterns that any developer can understand
- **Industrial-Ready**: Handles thousands of users with optimal performance

## 📁 Architecture

```
src/layouts/
├── core/                     # Core layout components
│   └── BaseLayout.vue        # Reusable layout structure
├── components/               # Layout sub-components  
│   ├── AppHeader.vue         # Consistent header component
│   ├── AppSidebar.vue        # Dynamic sidebar component
│   └── AppBreadcrumb.vue     # Breadcrumb navigation
├── composables/              # Vue composables
│   ├── useLayout.ts          # Layout state management
│   └── useNavigation.ts      # Navigation & permissions
└── types/                    # TypeScript definitions
    └── role.types.ts         # Interfaces for roles/permissions
```

## 🚀 Quick Start

### 1. Using the Layout System

```vue
<!-- In your page component -->
<template>
  <BaseLayout>
    <template #content>
      <h1>Your Page Title</h1>
      <!-- Your page content -->
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/core/BaseLayout.vue'
// Navigation automatically filters based on user role and permissions
</script>
```

### 2. Different Layout Variants

```vue
<!-- Minimal variant for focused interfaces -->
<BaseLayout variant="minimal">
  <template #content>
    <!-- Content with minimal padding -->
  </template>
</BaseLayout>

<!-- Compact variant for data-heavy interfaces -->
<BaseLayout variant="compact">
  <template #content>
    <!-- Content with compact spacing -->
  </template>
</BaseLayout>

<!-- Default variant for standard pages -->
<BaseLayout variant="default">
  <template #content>
    <!-- Content with standard spacing -->
  </template>
</BaseLayout>
```

### 3. Using Navigation Composable

```typescript
import { useNavigation } from '@/layouts/composables/useNavigation'

const {
  primaryNavigation,      // Main navigation items (filtered by permissions)
  secondaryNavigation,    // Secondary navigation items
  applicationNavigation,  // Application-specific items
  hasPermission,          // Check single permission
  hasAnyPermission,       // Check multiple permissions (any)
  hasAllPermissions       // Check multiple permissions (all required)
} = useNavigation()

// Check permissions
const canCreateApplication = await hasPermission('create:application')
const canAccessReports = await hasAnyPermission(['view:reports', 'manage:reports'])
```

## 🔧 Core Components

### BaseLayout.vue
**The foundation component used on every page**

**Features:**
- ✅ Consistent sidebar, header, and content areas
- ✅ Theme support (light/dark)
- ✅ Layout variants (default/minimal/compact)
- ✅ Responsive design for mobile and desktop
- ✅ Loading states for navigation and layout

**Props:**
```typescript
interface Props {
  variant?: 'default' | 'minimal' | 'compact'
  showSidebar?: boolean
  showHeader?: boolean
  showBreadcrumb?: boolean
}
```

### AppSidebar.vue
**Dynamic sidebar component with role-based navigation**

**Features:**
- ✅ Same component everywhere, content changes based on role
- ✅ Permission-filtered navigation items
- ✅ Collapsible design with responsive behavior
- ✅ Badge support for notifications
- ✅ Theme and role-specific styling
- ✅ Submenu support for hierarchical navigation

**Dynamic Navigation:**
```typescript
// Navigation automatically includes only items user can access
Guardian: Dashboard, Children, Applications
Caseworker: Dashboard, Review Queue, Placement Management
Admin: Dashboard, User Management, System Configuration
```

### AppHeader.vue
**Consistent header across all pages**

**Features:**
- ✅ User-specific content and notifications
- ✅ Theme switching support
- ✅ Responsive behavior for mobile
- ✅ Role-based styling and actions

## 🛡️ Permission System

### How Navigation Filtering Works

```typescript
// 1. User logs in and role is determined
// 2. Navigation service fetches navigation config for role
// 3. Permission service filters items based on user permissions
// 4. AppSidebar receives filtered navigation items
// 5. Only accessible items are displayed

// Example: Guardian user
const guardianNavigation = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    route: '/guardian',
    requiredPermissions: ['view:dashboard']  // ✅ Guardian has this
  },
  {
    id: 'admin-users',
    label: 'User Management',
    route: '/admin/users',
    requiredPermissions: ['manage:users']    // ❌ Guardian doesn't have this
  }
]
// Result: Only Dashboard item is shown
```

### Permission Checking in Components

```vue
<template>
  <div>
    <!-- Always visible content -->
    <h1>Dashboard</h1>
    
    <!-- Conditionally visible based on permissions -->
    <button v-if="canCreateApplication">
      Create New Application
    </button>
    
    <section v-if="canViewReports">
      <!-- Reports section -->
    </section>
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from '@/layouts/composables/useNavigation'

const navigation = useNavigation()

// Check permissions
const canCreateApplication = await navigation.hasPermission('create:application')
const canViewReports = await navigation.hasPermission('view:reports')
</script>
```

## 🎨 Theming & Customization

### Theme Configuration

Themes are configured per role in the database:

```json
{
  "layoutSettings": {
    "theme": "light", // or "dark"
    "showBreadcrumb": true,
    "showNotifications": true,
    "sidebarCollapsible": true
  }
}
```

### CSS Custom Properties

The layout system supports CSS custom properties for theming:

```css
.theme-light {
  --bg-primary: #ffffff;
  --text-primary: #1f2937;
  --border-color: #e5e7eb;
}

.theme-dark {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
  --border-color: #374151;
}
```

### Role-Specific Styling

```css
/* Different border colors for different roles */
.app-sidebar.role-guardian {
  border-right-color: #3b82f6; /* Blue for guardians */
}

.app-sidebar.role-caseworker {
  border-right-color: #10b981; /* Green for caseworkers */
}

.app-sidebar.role-admin {
  border-right-color: #f59e0b; /* Yellow for admins */
}
```

## 🧪 Testing & Demo

### Demo System

Visit `/demo` to see the layout system in action:

- View current role configuration
- See navigation filtering in real-time
- Test different user roles
- Inspect responsive behavior
- Update badge data

### Navigation Testing

```javascript
// Test navigation filtering
import { useNavigation } from '@/layouts/composables/useNavigation'

test('filters navigation based on user permissions', async () => {
  const navigation = useNavigation()
  await navigation.loadNavigation()
  
  expect(navigation.primaryNavigation.value).toHaveLength(3)
  expect(navigation.primaryNavigation.value[0].id).toBe('dashboard')
})
```

## 🔄 Development vs Production

### Development Mode (Mock Data)

- Uses mock roles and permissions
- No API calls required
- Perfect for offline development
- Mock data defined in services

### Production Mode (Database)

- Fetches roles from `/api/roles/{roleId}`
- Gets user permissions from `/api/users/{userId}/permissions`
- Navigation config from `/api/roles/{roleId}/navigation`
- Real-time permission updates

## 📊 API Endpoints

The system expects these API endpoints in production:

```
GET  /api/roles/{roleId}                    # Get role details
GET  /api/roles/{roleId}/navigation         # Get navigation config
GET  /api/users/{userId}/permissions        # Get user permissions
PUT  /api/roles/{roleId}/navigation         # Update navigation config
```

## 🎯 Benefits

### For Development Team:
- **Simple Architecture**: Standard Vue patterns, easy to understand
- **Consistent UI**: Same components everywhere, reduces maintenance
- **Type Safety**: Full TypeScript support
- **Easy Testing**: Standard component testing approaches

### For Users:
- **Consistent Experience**: Same layout and navigation patterns
- **Role-Appropriate Content**: See only what's relevant to their role
- **Responsive Design**: Works on all devices
- **Fast Performance**: Optimized for large user bases

### For Administrators:
- **Dynamic Control**: Change navigation via database
- **Permission Management**: Fine-grained access control
- **Real-time Updates**: Changes reflect immediately
- **Audit Trail**: Track navigation and permission changes

## 🔧 Troubleshooting

### Common Issues

**Navigation not loading:**
- Check user authentication state
- Verify role permissions in database
- Check network connectivity to API

**Layout not responsive:**
- Verify CSS viewport meta tag
- Check for conflicting CSS styles
- Test on different devices

**Theme not applying:**
- Check role configuration in database
- Verify CSS custom properties
- Clear browser cache

### Debug Information

Use the demo page (`/demo`) to inspect:
- Current user role and permissions
- Active navigation items
- Layout configuration
- Theme settings

---

## 📚 Examples

### Guardian Page
```vue
<template>
  <BaseLayout>
    <template #content>
      <h1>Guardian Dashboard</h1>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="card">
          <h2>My Children</h2>
          <!-- Children list -->
        </div>
        <div class="card">
          <h2>Applications</h2>
          <!-- Application status -->
        </div>
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/core/BaseLayout.vue'
// Sidebar automatically shows: Dashboard, Children, Applications
// Header shows: Guardian-specific notifications and actions
</script>
```

### Caseworker Page
```vue
<template>
  <BaseLayout variant="compact">
    <template #content>
      <h1>Case Review Dashboard</h1>
      <div class="review-queue">
        <!-- Application review interface -->
      </div>
    </template>
  </BaseLayout>
</template>

<script setup lang="ts">
import BaseLayout from '@/layouts/core/BaseLayout.vue'
// Sidebar automatically shows: Dashboard, Review Queue, Placement Management
// Header shows: Caseworker tools and pending review count
</script>
```

This layout system provides a solid foundation for building consistent, maintainable, and user-friendly interfaces while keeping the codebase simple and developer-friendly!