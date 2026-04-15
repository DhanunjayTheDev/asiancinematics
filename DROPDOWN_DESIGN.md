# CustomSelect Dropdown Component

## Overview

A custom, reusable dropdown/select component that provides a consistent, modern design across all pages in both the client and admin applications. The component replaces all native `<select>` elements with a fully styled, feature-rich dropdown with search functionality.

## Features

### Client Version (`client/src/components/CustomSelect.tsx`)
- **Theme**: Dark mode with blue/yellow accent colors matching the Pravara World Tech branding
- **Styling**: Blue borders, yellow focus state, semi-transparent dark backgrounds
- **Features**:
  - Searchable options with real-time filtering
  - Keyboard navigation (Escape, Enter)
  - Click-outside detection to close dropdown
  - Smooth chevron icon animation
  - Selected item indicator (yellow dot)
  - Disabled state support
  - Required/hidden input support for form submission

### Admin Version (`admin/src/components/CustomSelect.tsx`)
- **Theme**: Light mode with blue accents matching admin panel design
- **Styling**: Light gray borders, blue focus ring, white background
- **Features**: Same as client version but with light theme colors

## Usage

### Basic Example
```tsx
import CustomSelect from '../components/CustomSelect';

<CustomSelect
  value={selectedValue}
  onChange={(value) => setSelectedValue(value)}
  options={[
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]}
  placeholder="Select an option"
/>
```

### With Dynamic Options
```tsx
<CustomSelect
  value={status}
  onChange={(value) => setStatus(String(value))}
  options={items.map((item) => ({
    value: item._id,
    label: item.name,
  }))}
  placeholder="Select item"
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `value` | string \| number | Yes | - | Current selected value |
| `onChange` | function | Yes | - | Callback when selection changes |
| `options` | array | Yes | - | Array of options with `value` and `label` |
| `placeholder` | string | No | "Select an option" | Placeholder text |
| `disabled` | boolean | No | false | Disable the dropdown |
| `className` | string | No | "" | Additional CSS classes |
| `required` | boolean | No | false | Mark input as required |
| `name` | string | No | "" | Input field name for form submission |

## Pages Updated

### Client Application
- ✅ ServiceRequestPage - Priority selection
- ✅ BookVisitPage - Time slot selection
- ✅ ProductsPage - Sort by selection
- ✅ OrdersPage - Status filter
- ✅ LandingPage - Project type in consultation form

### Admin Application
- ✅ UsersPage - Role assignment
- ✅ TicketsPage - Status filter and update
- ✅ SiteVisitsPage - Status management and staff assignment
- ✅ InquiriesPage - Inquiry status update
- ✅ ProductsPage - Category selection
- ✅ OrdersPage - Order status update
- ✅ CategoriesPage - Parent category selection

## Component Features

1. **Search Functionality**
   - Real-time filtering of options as user types
   - Case-insensitive search
   - "No options found" message when no matches

2. **Keyboard Navigation**
   - `Escape` - Close dropdown and clear search
   - `Enter` - Select filtered option (if only one matches)
   - `Shift+Tab` / `Tab` - Navigate away from dropdown

3. **Visual Feedback**
   - Smooth chevron animation on open/close
   - Selected item highlighted with dot indicator
   - Hover effects on options
   - Focus state with colored border
   - Disabled state with reduced opacity

4. **Accessibility**
   - Proper focus management
   - Auto-focus search input on open
   - Hidden input for form submission
   - Semantic HTML structure

5. **Responsive Design**
   - Dropdown positioned relative to trigger button
   - Auto-closing when clicking outside
   - Scrollable options list (max-height: 12rem)
   - Works on all screen sizes

## Design System

### Dark Theme (Client)
- Trigger: `bg-black/40 border border-blue-500/30`
- Hover: `hover:border-blue-500/50`
- Focus: `focus:border-yellow-400`
- Options: `bg-gradient-to-br from-blue-900/30 to-blue-800/20`
- Selected: `bg-yellow-500/20 text-yellow-300 border-l-2 border-l-yellow-400`

### Light Theme (Admin)
- Trigger: `bg-gray-100 border border-gray-300`
- Hover: `hover:border-gray-400`
- Focus: `focus:ring-2 focus:ring-blue-500`
- Options: `bg-white border border-gray-300`
- Selected: `bg-blue-50 text-blue-600 border-l-2 border-l-blue-500`

## Benefits

1. **Consistency**: Same dropdown experience across all pages
2. **Better UX**: Search functionality reduces scrolling in long lists
3. **Customizable**: Easy to style differently for client/admin
4. **Accessible**: Full keyboard support and semantic HTML
5. **Maintainability**: Single component to update instead of multiple `<select>` elements
6. **Type-safe**: Works with both string and number values
7. **Performance**: Lightweight component with no external dependencies

## Migration from Native Select

All instances of `<select>` elements have been replaced:

**Before:**
```tsx
<select value={status} onChange={(e) => setStatus(e.target.value)}>
  <option value="">All</option>
  <option value="active">Active</option>
  <option value="inactive">Inactive</option>
</select>
```

**After:**
```tsx
<CustomSelect
  value={status}
  onChange={(value) => setStatus(String(value))}
  options={[
    { value: '', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]}
/>
```

## Future Enhancements

- Multi-select support
- Option groups
- Custom option rendering
- Virtual scrolling for large lists
- Keyboard shortcuts for quick selection
