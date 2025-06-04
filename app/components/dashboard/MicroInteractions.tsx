import React, { useRef } from 'react';
import { Animated, TouchableOpacity, View, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: any;
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection';
  scaleValue?: number;
  disabled?: boolean;
}

export function HapticButton({
  children,
  onPress,
  style,
  hapticType = 'light',
  scaleValue = 0.95,
  disabled = false,
}: HapticButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (disabled) return;

    // Haptic feedback
    switch (hapticType) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
      case 'selection':
        Haptics.selectionAsync();
        break;
    }

    // Scale animation
    Animated.spring(scaleAnim, {
      toValue: scaleValue,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;

    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[style, disabled && styles.disabled]}
    >
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

interface PulseViewProps {
  children: React.ReactNode;
  style?: any;
  pulseColor?: string;
  duration?: number;
}

export function PulseView({
  children,
  style,
  pulseColor = '#057B8C',
  duration = 2000,
}: PulseViewProps) {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: duration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: duration / 2,
          useNativeDriver: true,
        }),
      ]).start(pulse);
    };

    pulse();
  }, [pulseAnim, duration]);

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.05],
  });

  return (
    <View style={style}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: pulseColor,
            opacity: pulseOpacity,
            transform: [{ scale: pulseScale }],
            borderRadius: style?.borderRadius || 0,
          },
        ]}
      />
      {children}
    </View>
  );
}

interface ShimmerViewProps {
  width: number;
  height: number;
  borderRadius?: number;
  style?: any;
}

export function ShimmerView({ width, height, borderRadius = 8, style }: ShimmerViewProps) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const shimmer = () => {
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }).start(() => {
        shimmerAnim.setValue(0);
        shimmer();
      });
    };

    shimmer();
  }, [shimmerAnim]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#F3F4F6',
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          {
            backgroundColor: '#E5E7EB',
            transform: [{ translateX }],
            width: width * 0.5,
          },
        ]}
      />
    </View>
  );
}

interface CountUpAnimationProps {
  from: number;
  to: number;
  duration?: number;
  formatter?: (value: number) => string;
  style?: any;
}

export function CountUpAnimation({
  from,
  to,
  duration = 1000,
  formatter = (value) => value.toFixed(0),
  style,
}: CountUpAnimationProps) {
  const animatedValue = useRef(new Animated.Value(from)).current;
  const [displayValue, setDisplayValue] = React.useState(from);

  React.useEffect(() => {
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(value);
    });

    Animated.timing(animatedValue, {
      toValue: to,
      duration,
      useNativeDriver: false,
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [to, duration]);

  return <Animated.Text style={style}>{formatter(displayValue)}</Animated.Text>;
}

interface FadeInViewProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: any;
}

export function FadeInView({ children, delay = 0, duration = 600, style }: FadeInViewProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}

// Success animation for completed actions
interface SuccessCheckmarkProps {
  size?: number;
  color?: string;
  style?: any;
}

export function SuccessCheckmark({ size = 24, color = '#10B981', style }: SuccessCheckmarkProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        useNativeDriver: true,
        tension: 200,
        friction: 4,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 200,
        friction: 8,
      }),
    ]).start();

    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-45deg', '0deg'],
  });

  return (
    <Animated.View
      style={[
        {
          width: size,
          height: size,
          transform: [{ scale: scaleAnim }, { rotate: rotation }],
        },
        style,
      ]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            width: size * 0.4,
            height: size * 0.2,
            borderBottomWidth: 2,
            borderRightWidth: 2,
            borderColor: '#FFFFFF',
            transform: [{ rotate: '45deg' }],
            marginTop: -size * 0.1,
          }}
        />
      </View>
    </Animated.View>
  );
}

// Loading dots animation
export function LoadingDots({ color = '#057B8C', size = 8 }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const animateDots = () => {
      const animateDot = (dot: Animated.Value, delay: number) => {
        return Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]);
      };

      Animated.loop(
        Animated.parallel([animateDot(dot1, 0), animateDot(dot2, 200), animateDot(dot3, 400)])
      ).start();
    };

    animateDots();
  }, []);

  const Dot = ({ animatedValue }: { animatedValue: Animated.Value }) => {
    const opacity = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    const scale = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 1.2],
    });

    return (
      <Animated.View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          marginHorizontal: 2,
          opacity,
          transform: [{ scale }],
        }}
      />
    );
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Dot animatedValue={dot1} />
      <Dot animatedValue={dot2} />
      <Dot animatedValue={dot3} />
    </View>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.5,
  },
});
