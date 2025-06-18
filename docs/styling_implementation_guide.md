# 🎨 TravelPal Styling Implementation Guide

> **Complete guide for implementing consistent styling across all components using the TravelPal design system**

---

## 📋 **Overview**

This guide provides practical examples and implementation patterns for using TravelPal's comprehensive design system. Every component should follow these standards to ensure visual consistency, accessibility, and premium user experience.

### **Import the Design System**

```typescript
import {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animations,
  components,
  platform,
} from '../src/theme/designSystem';
```

---

## 🧩 **Component Implementation Examples**

### **1. Button Components**

#### **Primary Button**

```typescript
const PrimaryButton = ({ title, onPress, size = 'medium' }) => (
  <TouchableOpacity
    style={[
      styles.buttonBase,
      styles.buttonPrimary,
      styles[`button${size.charAt(0).toUpperCase() + size.slice(1)}`]
    ]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[typography.styles.button, { color: colors.text }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  buttonBase: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.button,
    ...shadows.accent,
  },
  buttonPrimary: {
    backgroundColor: colors.accent,
  },
  buttonSmall: {
    height: components.button.height.small,
    paddingHorizontal: components.button.padding.small.horizontal,
  },
  buttonMedium: {
    height: components.button.height.medium,
    paddingHorizontal: components.button.padding.medium.horizontal,
  },
  buttonLarge: {
    height: components.button.height.large,
    paddingHorizontal: components.button.padding.large.horizontal,
  },
});
```

#### **Secondary Button**

```typescript
const SecondaryButton = ({ title, onPress }) => (
  <TouchableOpacity style={styles.secondaryButton} onPress={onPress}>
    <Text style={[typography.styles.button, { color: colors.text }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  secondaryButton: {
    height: components.button.height.medium,
    paddingHorizontal: components.button.padding.medium.horizontal,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

### **2. Input Components**

#### **Text Input**

```typescript
const TextInput = ({ value, onChangeText, placeholder, error }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={[
        styles.input,
        error && styles.inputError
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.textTertiary}
    />
    {error && (
      <Text style={styles.errorText}>{error}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: spacing.md,
  },
  input: {
    height: components.input.height.medium,
    paddingHorizontal: components.input.padding.horizontal,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.input,
    borderWidth: components.input.borderWidth,
    borderColor: colors.border,
    ...typography.styles.body,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    ...typography.styles.small,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
```

### **3. Card Components**

#### **Standard Card**

```typescript
const Card = ({ children, elevated = false }) => (
  <View style={[
    styles.card,
    elevated && styles.cardElevated
  ]}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    padding: components.card.padding.medium,
    borderRadius: borderRadius.card,
    borderWidth: components.card.borderWidth,
    borderColor: colors.border,
    ...shadows.md,
  },
  cardElevated: {
    backgroundColor: colors.surfaceElevated,
    padding: components.card.padding.large,
    ...shadows.lg,
  },
});
```

#### **List Card**

```typescript
const ListCard = ({ title, subtitle, onPress, selected = false }) => (
  <TouchableOpacity
    style={[
      styles.listCard,
      selected && styles.listCardSelected
    ]}
    onPress={onPress}
  >
    <Text style={[
      typography.styles.body,
      selected && { color: colors.accent }
    ]}>
      {title}
    </Text>
    {subtitle && (
      <Text style={[
        typography.styles.caption,
        { marginTop: spacing.xs }
      ]}>
        {subtitle}
      </Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listCard: {
    backgroundColor: colors.surfaceElevated,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: spacing.xs,
  },
  listCardSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accentBackground,
  },
});
```

### **4. Modal Components**

#### **Modal Container**

```typescript
const Modal = ({ visible, onClose, title, children }) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    presentationStyle={platform.current.modalPresentationStyle}
  >
    <TouchableWithoutFeedback onPress={onClose}>
      <View style={styles.modalOverlay}>
        <TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={typography.styles.h3}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <FontAwesome name="times" size={20} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              {children}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.modal,
    borderTopRightRadius: borderRadius.modal,
    paddingHorizontal: spacing.modal,
    paddingBottom: spacing.xl,
    maxHeight: components.modal.maxHeight,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: components.modal.headerHeight,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    width: spacing.touchTarget,
    height: spacing.touchTarget,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingTop: spacing.lg,
  },
});
```

### **5. Chip Components**

#### **Selection Chip**

```typescript
const Chip = ({ title, selected = false, onPress }) => (
  <TouchableOpacity
    style={[
      styles.chip,
      selected && styles.chipSelected
    ]}
    onPress={onPress}
  >
    <Text style={[
      typography.styles.chip,
      selected && styles.chipTextSelected
    ]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  chip: {
    height: components.chip.height,
    paddingHorizontal: components.chip.padding.horizontal,
    backgroundColor: colors.surfaceElevated,
    borderRadius: borderRadius.chip,
    borderWidth: components.chip.borderWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  chipSelected: {
    backgroundColor: colors.accentBackground,
    borderColor: colors.accent,
  },
  chipTextSelected: {
    color: colors.accent,
  },
});
```

---

## 📏 **Layout Implementation**

### **Screen Layout**

```typescript
const ScreenLayout = ({ children, title }) => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={typography.styles.h2}>{title}</Text>
    </View>
    <ScrollView
      style={styles.content}
      contentContainerStyle={styles.contentContainer}
    >
      {children}
    </ScrollView>
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    height: spacing.headerHeight,
    paddingHorizontal: spacing.screen,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.screen,
    paddingVertical: spacing.lg,
  },
});
```

### **Section Layout**

```typescript
const Section = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={[typography.styles.h4, styles.sectionTitle]}>
      {title}
    </Text>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginBottom: spacing.section,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  sectionContent: {
    // Content styling
  },
});
```

### **Grid Layout**

```typescript
const Grid = ({ children, columns = 2 }) => (
  <View style={styles.grid}>
    {React.Children.map(children, (child, index) => (
      <View style={[
        styles.gridItem,
        { width: `${100 / columns}%` }
      ]}>
        {child}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -spacing.gridGutter / 2,
  },
  gridItem: {
    paddingHorizontal: spacing.gridGutter / 2,
    marginBottom: spacing.gridRowGap,
  },
});
```

---

## 🎭 **Animation Implementation**

### **Button Press Animation**

```typescript
const AnimatedButton = ({ children, onPress }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleValue, {
      toValue: animations.presets.buttonPress.scale,
      duration: animations.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleValue, {
      toValue: 1,
      duration: animations.duration.fast,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};
```

### **Fade In Animation**

```typescript
const FadeInView = ({ children, delay = 0 }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: animations.duration.normal,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};
```

---

## ✅ **Implementation Checklist**

### **Before Creating Any Component:**

- [ ] Import design system tokens
- [ ] Use predefined colors from `colors` object
- [ ] Apply spacing using `spacing` values
- [ ] Use typography styles from `typography.styles`
- [ ] Apply appropriate border radius from `borderRadius`
- [ ] Add shadows using `shadows` presets
- [ ] Ensure touch targets are minimum 44pt
- [ ] Use platform-appropriate patterns
- [ ] Test accessibility with screen reader
- [ ] Verify contrast ratios meet WCAG standards

### **Style Sheet Structure:**

```typescript
const styles = StyleSheet.create({
  // Container/Layout styles first
  container: {
    backgroundColor: colors.background,
    padding: spacing.screen,
  },

  // Component-specific styles
  component: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    ...shadows.md,
  },

  // Text styles
  title: {
    ...typography.styles.h3,
    marginBottom: spacing.md,
  },

  // Interactive element styles
  button: {
    backgroundColor: colors.accent,
    borderRadius: borderRadius.button,
    ...shadows.accent,
  },

  // State-specific styles last
  selected: {
    borderColor: colors.accent,
  },
  disabled: {
    opacity: 0.5,
  },
});
```

---

## 🚀 **Best Practices**

### **Performance**

- Use `memo` for static components
- Apply `useCallback` for event handlers
- Use `useMemo` for expensive calculations
- Optimize animations with `useNativeDriver: true`

### **Accessibility**

- Always provide `accessibilityLabel`
- Use `accessibilityRole` appropriately
- Ensure minimum touch target size (44pt)
- Test with screen reader enabled

### **Consistency**

- Never hardcode colors, spacing, or typography
- Always use design system tokens
- Follow naming conventions
- Document custom components

### **Platform Considerations**

- Use `Platform.select()` for platform-specific styles
- Respect platform modal presentation styles
- Apply appropriate haptic feedback (iOS)
- Use platform elevation patterns (Android)

---

_This implementation guide ensures every component follows TravelPal's premium design standards while maintaining consistency, accessibility, and performance across the entire application._
