# 🌙 TravelPal Dark Mode Component Library

> **Comprehensive guide to TravelPal's dark-first component system**

---

## 📋 **Overview**

TravelPal's component library prioritizes dark mode as the primary experience, with all components designed for premium dark interfaces. This library provides consistent, reusable components that maintain excellent accessibility and visual hierarchy in dark environments.

### **Design Philosophy**

- **Dark-First**: All components designed primarily for dark interfaces
- **Accessibility**: High contrast ratios (4.5:1 minimum) for text readability
- **Consistency**: Unified color palette and interaction patterns
- **Performance**: Optimized for OLED displays with pure black backgrounds
- **Future-Ready**: Built to support light mode theming when needed

---

## 🎨 **Core Color System**

### **Dark Theme Palette**

```typescript
export const darkTheme = {
  // Background Hierarchy
  background: '#000000', // Pure black - main screens
  surface: '#171717', // Dark surface - modals, cards
  card: '#262626', // Elevated elements

  // Text Hierarchy
  text: '#FFFFFF', // Primary text
  textSecondary: '#CCCCCC', // Secondary text
  textTertiary: '#666666', // Placeholders

  // Interactive Elements
  accent: '#007AFF', // Blue accent
  accentBg: 'rgba(0, 122, 255, 0.1)', // Light accent background
  border: '#404040', // Borders and dividers
  overlay: 'rgba(0, 0, 0, 0.7)', // Modal overlays
};
```

---

## 🧩 **Component Library**

### **1. Dark Modals**

#### **Modal Container Pattern**

```typescript
// Standard Dark Modal Implementation
const DarkModal = ({ visible, onClose, children }) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    presentationStyle={Platform.OS === 'ios' ? 'pageSheet' : 'overFullScreen'}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            {children}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#171717',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
});
```

#### **Modal Header Pattern**

```typescript
const DarkModalHeader = ({ title, onClose }) => (
  <View style={styles.modalHeader}>
    <Text style={styles.modalTitle}>{title}</Text>
    <TouchableOpacity onPress={onClose}>
      <FontAwesome name="times" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
```

### **2. Dark Input Components**

#### **DarkCountryPicker**

Premium country selection with search functionality:

```typescript
// Features:
// - Dark background (#262626)
// - White text with gray placeholders
// - Search functionality with country data integration
// - Popular destinations chips
// - Modal presentation with pageSheet style

const pickerButtonStyle = {
  backgroundColor: '#262626',
  borderRadius: 8,
  padding: 16,
  borderWidth: 1,
  borderColor: '#404040',
};
```

#### **DarkDateSelector**

Optional date selection with clear functionality:

```typescript
// Features:
// - Optional date support
// - Clear button functionality
// - Dark calendar styling
// - Consistent with picker styling

const dateInputStyle = {
  backgroundColor: '#262626',
  borderRadius: 8,
  padding: 16,
  borderColor: '#404040',
  color: '#FFFFFF',
};
```

#### **Dark Search Input**

Search input with icon and clear functionality:

```typescript
const DarkSearchInput = ({ value, onChangeText, placeholder }) => (
  <View style={styles.searchContainer}>
    <FontAwesome name="search" size={16} color="#CCCCCC" style={styles.searchIcon} />
    <TextInput
      style={styles.searchInput}
      placeholder={placeholder}
      placeholderTextColor="#666666"
      value={value}
      onChangeText={onChangeText}
      autoCapitalize="none"
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')}>
        <FontAwesome name="times-circle" size={16} color="#CCCCCC" />
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    borderRadius: 10,
    paddingHorizontal: 12,
    marginVertical: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
});
```

### **3. Dark Button System**

#### **Primary Button (Blue Accent)**

```typescript
const DarkPrimaryButton = ({ title, onPress, disabled }) => (
  <TouchableOpacity
    style={[styles.primaryButton, disabled && styles.buttonDisabled]}
    onPress={onPress}
    disabled={disabled}
  >
    <Text style={styles.primaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#404040',
    shadowOpacity: 0,
  },
});
```

#### **Secondary Button (Dark with Border)**

```typescript
const DarkSecondaryButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
    <Text style={styles.secondaryButtonText}>{title}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});
```

#### **Chip/Tag Buttons**

```typescript
const DarkChip = ({ title, selected, onPress }) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    backgroundColor: '#262626',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#404040',
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderColor: '#007AFF',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#CCCCCC',
  },
  chipTextSelected: {
    color: '#007AFF',
  },
});
```

### **4. Dark Card System**

#### **Standard Dark Card**

```typescript
const DarkCard = ({ children, elevated = false }) => (
  <View style={[styles.card, elevated && styles.elevatedCard]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#171717',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#404040',
  },
  elevatedCard: {
    backgroundColor: '#262626',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
});
```

#### **Timeline/List Card**

```typescript
const DarkListCard = ({ children, selected = false }) => (
  <View style={[styles.listCard, selected && styles.listCardSelected]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: '#262626',
    borderRadius: 12,
    padding: 16,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#404040',
  },
  listCardSelected: {
    borderColor: '#007AFF',
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
});
```

### **5. Dark List Components**

#### **Dark List Item**

```typescript
const DarkListItem = ({ title, subtitle, onPress, icon, selected }) => (
  <TouchableOpacity
    style={[styles.listItem, selected && styles.listItemSelected]}
    onPress={onPress}
  >
    <View style={styles.listItemContent}>
      <Text style={[styles.listItemTitle, selected && styles.listItemTitleSelected]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={styles.listItemSubtitle}>{subtitle}</Text>
      )}
    </View>
    {icon && <View style={styles.listItemIcon}>{icon}</View>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#404040',
  },
  listItemSelected: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  listItemContent: {
    flex: 1,
  },
  listItemTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listItemTitleSelected: {
    color: '#007AFF',
  },
  listItemSubtitle: {
    fontSize: 14,
    color: '#CCCCCC',
    marginTop: 2,
  },
  listItemIcon: {
    marginLeft: 12,
  },
});
```

---

## 📱 **Platform Implementations**

### **iOS-Specific Dark Patterns**

```typescript
const iOSDarkPatterns = {
  // Modal Presentation
  modalPresentationStyle: 'pageSheet',

  // Status Bar
  statusBarStyle: 'light-content',

  // Navigation
  navigationBarStyle: 'black',

  // Safe Areas
  safeAreaInsets: 'respect with dark background',

  // Haptic Feedback
  hapticFeedback: 'enhanced for dark interfaces',
};
```

### **Android-Specific Dark Patterns**

```typescript
const androidDarkPatterns = {
  // Modal Presentation
  modalPresentationStyle: 'overFullScreen',

  // Status Bar
  statusBarStyle: 'light-content',
  statusBarTranslucent: true,

  // Navigation
  navigationBarColor: '#000000',

  // Material Design
  materialVersion: '3.0 dark theme guidelines',

  // System Integration
  systemDarkMode: 'respect Android 10+ settings',
};
```

---

## 🔧 **Usage Guidelines**

### **Implementation Checklist**

When creating new dark mode components:

- [ ] Use pure black (#000000) for main backgrounds
- [ ] Use #171717 for modal/card surfaces
- [ ] Use #262626 for input fields and elevated elements
- [ ] Use #FFFFFF for primary text
- [ ] Use #CCCCCC for secondary text
- [ ] Use #666666 for placeholders and tertiary text
- [ ] Use #404040 for borders and dividers
- [ ] Use #007AFF for accent colors and interactive elements
- [ ] Ensure 4.5:1 contrast ratio for text
- [ ] Add proper focus indicators
- [ ] Support tap-outside-to-dismiss for modals
- [ ] Use appropriate platform presentation styles

### **Accessibility Requirements**

- **Text Contrast**: Minimum 4.5:1 ratio for normal text, 3:1 for large text
- **Focus Indicators**: Visible focus rings with #007AFF color
- **Touch Targets**: Minimum 44pt touch targets
- **Screen Reader**: Proper accessibility labels and hints
- **Dynamic Type**: Support for text scaling

### **Performance Considerations**

- **OLED Optimization**: Use pure black (#000000) for power savings
- **Shadow Usage**: Minimize expensive shadow effects
- **Image Optimization**: Use darker images for better integration
- **Animation**: Smooth 60fps animations with reduced motion support

---

## 🚀 **Future Enhancements**

### **Theme Context Implementation**

```typescript
// Future theme context for light/dark switching
const ThemeContext = createContext({
  theme: 'dark',
  colors: darkTheme,
  toggleTheme: () => {},
});

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

### **Component Migration Strategy**

1. **Phase 1**: Update existing components to use dark theme by default
2. **Phase 2**: Create theme-aware component variants
3. **Phase 3**: Implement theme context and user preferences
4. **Phase 4**: Add light mode support while maintaining dark priority

---

## 📚 **Component Reference**

### **Available Dark Components**

- ✅ **DarkCountryPicker** - Country selection with search
- ✅ **DarkDateSelector** - Optional date picker
- ✅ **AddLegModal** - Trip leg creation modal
- ✅ **LegTimeline** - Horizontal leg timeline
- ✅ **LegChip** - Individual leg display chip
- 🔄 **DarkBudgetPicker** - Budget input component (planned)
- 🔄 **DarkItineraryCard** - Itinerary item card (planned)
- 🔄 **DarkSettingsModal** - Settings modal (planned)

### **Styling Patterns**

All components follow consistent patterns:

- Dark backgrounds with subtle borders
- White primary text, gray secondary text
- Blue accent for interactive elements
- Consistent border radius (8px inputs, 12px buttons, 16px cards)
- Proper spacing using 8px grid system
- Platform-appropriate modal presentations

---

_This component library serves as the foundation for TravelPal's premium dark-first user experience, ensuring consistency and quality across all interface elements._
