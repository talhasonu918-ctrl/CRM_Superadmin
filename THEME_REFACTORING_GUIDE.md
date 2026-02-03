# Theme Refactoring Progress

## ✅ Completed (14 files - 28%)

### Core Theme System
- ✅ src/theme/colors.ts (550+ lines)
- ✅ src/theme/README.md

### Core Utility Components  
- ✅ src/components/InfiniteTable.tsx
- ✅ src/components/SearchInput.tsx
- ✅ src/components/FilterDropdown.tsx
- ✅ src/components/ReusableModal.tsx
- ✅ src/components/ImageUpload.tsx
- ✅ src/components/UserModal.tsx
- ✅ src/components/NavigationLayout.tsx
- ✅ src/components/Modal.tsx
- ✅ src/components/Tabs.tsx
- ✅ src/components/dropdown.tsx
- ✅ src/components/Layout.tsx
- ✅ src/components/DeleteConfirmModal.tsx
- ✅ src/components/ColumnToggle.tsx

### POS Module
- ✅ src/app/modules/pos/components/AddCustomerModal.tsx

## 🔄 In Progress (0 files)

_None currently_

## ⏳ Remaining (36+ files - 72%)

### Settings User Module (5 files)
- ⏳ src/app/modules/settings/user/form/AddUserForm.tsx
- ⏳ src/app/modules/settings/user/form/EditUserForm.tsx  
- ⏳ src/app/modules/settings/user/form/ViewUserDetails.tsx
- ⏳ src/app/modules/settings/user/table/table.tsx
- ⏳ src/app/modules/settings/user/table/columns.tsx

### Settings Branches Module (5 files)
- ⏳ src/app/modules/settings/branches/form/AddBranchForm.tsx
- ⏳ src/app/modules/settings/branches/form/EditBranchForm.tsx
- ⏳ src/app/modules/settings/branches/form/ViewBranchDetails.tsx  
- ⏳ src/app/modules/settings/branches/table/table.tsx
- ⏳ src/app/modules/settings/branches/table/columns.tsx

### Settings Practice Module (4 files)
- ⏳ src/app/modules/settings/practice/form/PracticeSettingForm.tsx
- ⏳ src/app/modules/settings/practice/form/ViewPracticeSetting.tsx
- ⏳ src/app/modules/settings/practice/table/table.tsx
- ⏳ src/app/modules/settings/practice/table/columns.tsx

### Auth Module (1 file)
- ⏳ src/app/pages/Auth.tsx (100+ color references)

### POS Module (3 files)
- ⏳ src/app/modules/pos/POSView.tsx (50+ colors)
- ⏳ src/app/modules/pos/TablesView.tsx
- ⏳ src/app/modules/pos/TakeAwayView.tsx

### Other Pages (15+ files)
- ⏳ src/app/pages/StaffManagement.tsx
- ⏳ src/app/pages/Settings.tsx (main settings component)
- ⏳ Other admin pages...

---

## 📝 Standard Refactoring Pattern

For **every remaining file**, follow this 3-step pattern:

### Step 1: Add Theme Import
```typescript
import { getThemeColors } from '../../../theme/colors'; // Adjust path as needed
```

### Step 2: Add isDarkMode Prop
```typescript
interface ComponentProps {
  // ...existing props
  isDarkMode?: boolean;
}

const Component: React.FC<ComponentProps> = ({
  // ...existing props
  isDarkMode = false,
}) => {
  const theme = getThemeColors(isDarkMode);
  // ...rest of component
};
```

### Step 3: Replace Hardcoded Colors
Common replacements:

| Hardcoded Color | Replace With |
|----------------|--------------|
| `bg-white dark:bg-slate-800` | `${theme.neutral.background}` |
| `border-gray-300 dark:border-slate-700` | `${theme.border.input}` |
| `text-gray-900 dark:text-white` | `${theme.text.primary}` |
| `text-gray-500 dark:text-gray-400` | `${theme.text.tertiary}` |
| `bg-gray-50 dark:bg-slate-700` | `${theme.neutral.backgroundSecondary}` |
| `border-red-500` | `${theme.status.error.border}` |
| `text-red-500` | `${theme.status.error.text}` |
| `bg-orange-500 hover:bg-orange-600` | `${theme.button.primary}` |
| `border-slate-500 hover:bg-slate-500` | `${theme.button.secondary}` |
| `hover:bg-gray-100 dark:hover:bg-gray-800` | `${theme.neutral.hoverLight}` |

---

## 🎯 Priority Order

1. **HIGH**: Settings forms (user, branches, practice) - Most commonly used admin interface
2. **MEDIUM**: Auth page - Important but one-time use per session
3. **MEDIUM**: POS module - Customer-facing but limited files
4. **LOW**: Other admin pages - Less frequently accessed

---

## ✅ Verification Checklist

After refactoring each file:
- [ ] Theme import added
- [ ] isDarkMode prop added to interface
- [ ] const theme = getThemeColors(isDarkMode) added
- [ ] All hardcoded colors replaced
- [ ] TypeScript compiles without errors
- [ ] Component renders in light mode
- [ ] Component renders in dark mode
- [ ] isDarkMode prop passed from parent component

---

## 📊 Progress Tracking

- **Total Files**: 50
- **Completed**: 14 (28%)
- **Remaining**: 36 (72%)
- **Core Utilities**: 100% ✅
- **Settings Modules**: 0% ⏳
- **Auth**: 0% ⏳
- **POS**: 25% (1/4 files) 🔄
- **Other**: 0% ⏳

---

## 🚀 Next Steps

1. **Complete Settings User Module** (5 files)
   - Start with ViewUserDetails (simplest - no form logic)
   - Then AddUserForm and EditUserForm (form inputs)
   - Then table.tsx (table layout)
   - Finally columns.tsx (cell rendering)

2. **Replicate to Settings Branches** (5 files)
   - Copy pattern from User module
   - Adjust field names/labels

3. **Replicate to Settings Practice** (4 files)
   - Copy pattern from User/Branches modules

4. **Refactor Auth.tsx** (1 large file)
   - Most complex - 100+ colors
   - Break into logical sections

5. **Complete POS Module** (3 remaining files)
   - POSView, TablesView, TakeAwayView

6. **Final cleanup** (other pages)

---

## 💡 Tips

- **Pass isDarkMode down** from parent components that have access to theme context
- **Test frequently** - compile after each file to catch errors early
- **Use multi_replace_string_in_file** - batch multiple color replacements in one call
- **Reference completed files** - InfiniteTable, UserModal, ImageUpload show all patterns
- **Copy-paste theme initialization** - Same 3 lines in every component
- **Watch for react-select** - Needs special inline style handling (see FilterDropdown)

---

## 🐛 Common Issues

1. **Wrong theme property names**
   - ❌ `theme.border.sidebar` 
   - ✅ `theme.border.secondary`

2. **Missing nested properties**
   - ❌ `theme.status.errorBg`
   - ✅ `theme.status.error.bg`

3. **Forgetting to pass isDarkMode**
   - Always pass isDarkMode to child components that use theme

4. **Inline styles for third-party components**
   - react-select requires inline styles (see FilterDropdown example)
   - Can't use theme classes directly

---

Last Updated: 2024
