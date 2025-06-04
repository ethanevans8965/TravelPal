import React, { useRef, useEffect } from 'react';
import { View, Animated, Easing, StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface PageTransitionProps {
  children: React.ReactNode;
  transitionType?: 'fade' | 'slide' | 'scale' | 'slideUp';
  duration?: number;
  delay?: number;
  style?: any;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  transitionType = 'fade',
  duration = 400,
  delay = 0,
  style,
}) => {
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.timing(animationValue, {
      toValue: 1,
      duration,
      delay,
      easing: Easing.bezier(0.2, 0, 0.2, 1),
      useNativeDriver: true,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  const getTransformStyle = () => {
    switch (transitionType) {
      case 'fade':
        return {
          opacity: animationValue,
        };

      case 'slide':
        return {
          opacity: animationValue,
          transform: [
            {
              translateX: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [screenWidth * 0.1, 0],
              }),
            },
          ],
        };

      case 'slideUp':
        return {
          opacity: animationValue,
          transform: [
            {
              translateY: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };

      case 'scale':
        return {
          opacity: animationValue,
          transform: [
            {
              scale: animationValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        };

      default:
        return { opacity: animationValue };
    }
  };

  return <Animated.View style={[getTransformStyle(), style]}>{children}</Animated.View>;
};

// Staggered animation for lists
interface StaggeredTransitionProps {
  children: React.ReactNode[];
  staggerDelay?: number;
  transitionType?: 'fade' | 'slide' | 'slideUp';
  style?: any;
}

export const StaggeredTransition: React.FC<StaggeredTransitionProps> = ({
  children,
  staggerDelay = 100,
  transitionType = 'slideUp',
  style,
}) => {
  return (
    <View style={style}>
      {React.Children.map(children, (child, index) => (
        <PageTransition
          key={index}
          transitionType={transitionType}
          delay={index * staggerDelay}
          duration={400}
        >
          {child}
        </PageTransition>
      ))}
    </View>
  );
};

// Loading skeleton component
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();

    return () => {
      pulse.stop();
    };
  }, []);

  const opacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: '#E2E8F0',
          opacity,
        },
        style,
      ]}
    />
  );
};

// Card skeleton for expense cards
export const ExpenseCardSkeleton: React.FC = () => {
  return (
    <View style={styles.cardSkeleton}>
      <View style={styles.cardSkeletonLeft}>
        <Skeleton width={40} height={40} borderRadius={20} />
      </View>
      <View style={styles.cardSkeletonMiddle}>
        <Skeleton width="70%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="50%" height={12} />
      </View>
      <View style={styles.cardSkeletonRight}>
        <Skeleton width={80} height={16} style={{ marginBottom: 4 }} />
        <Skeleton width={40} height={12} />
      </View>
    </View>
  );
};

// List skeleton for expense lists
interface ListSkeletonProps {
  itemCount?: number;
}

export const ExpenseListSkeleton: React.FC<ListSkeletonProps> = ({ itemCount = 5 }) => {
  return (
    <View style={styles.listSkeleton}>
      {Array.from({ length: itemCount }).map((_, index) => (
        <ExpenseCardSkeleton key={index} />
      ))}
    </View>
  );
};

// Chart skeleton
export const ChartSkeleton: React.FC = () => {
  return (
    <View style={styles.chartSkeleton}>
      <Skeleton width="100%" height={200} borderRadius={12} />
      <View style={styles.chartSkeletonLegend}>
        <Skeleton width={60} height={12} style={{ marginRight: 16 }} />
        <Skeleton width={80} height={12} style={{ marginRight: 16 }} />
        <Skeleton width={70} height={12} />
      </View>
    </View>
  );
};

// Widget skeleton for home screen
export const WidgetSkeleton: React.FC = () => {
  return (
    <View style={styles.widgetSkeleton}>
      <View style={styles.widgetSkeletonHeader}>
        <Skeleton width={100} height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="100%" height={32} style={{ marginBottom: 16 }} />
      </View>
      <View style={styles.widgetSkeletonContent}>
        <Skeleton width="100%" height={8} borderRadius={4} style={{ marginBottom: 12 }} />
        <View style={styles.widgetSkeletonStats}>
          <Skeleton width={60} height={40} borderRadius={8} />
          <Skeleton width={60} height={40} borderRadius={8} />
          <Skeleton width={60} height={40} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
  },
  cardSkeletonLeft: {
    marginRight: 16,
  },
  cardSkeletonMiddle: {
    flex: 1,
  },
  cardSkeletonRight: {
    alignItems: 'flex-end',
  },
  listSkeleton: {
    padding: 16,
  },
  chartSkeleton: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
  },
  chartSkeletonLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  widgetSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  widgetSkeletonHeader: {
    marginBottom: 16,
  },
  widgetSkeletonContent: {
    // Content styles
  },
  widgetSkeletonStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PageTransition;
