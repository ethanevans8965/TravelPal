import React from 'react';
import { View, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

interface RecommendedSliderProps {
  value: number;
  recommendedValue: number;
  onValueChange: (value: number) => void;
  minimumValue?: number;
  maximumValue?: number;
  step?: number;
  style?: any;
}

const RecommendedSlider: React.FC<RecommendedSliderProps> = ({ 
  value, 
  recommendedValue, 
  onValueChange, 
  minimumValue = 0, 
  maximumValue = 100,
  step = 1,
  style
}) => {
  return (
    <View style={[styles.sliderContainer, style]}>
      <View style={styles.sliderTrack}>
        <View 
          style={[
            styles.recommendedTrack,
            { width: `${(recommendedValue / maximumValue) * 100}%` }
          ]} 
        />
        <View 
          style={[
            styles.activeTrack,
            { width: `${(value / maximumValue) * 100}%` }
          ]} 
        />
      </View>
      <Slider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="transparent"
        maximumTrackTintColor="transparent"
        thumbTintColor="#FF6B6B"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sliderContainer: {
    position: 'relative',
    width: '100%',
    height: 40,
  },
  sliderTrack: {
    position: 'absolute',
    top: 18,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#E5E5E5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  recommendedTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#FFB5B5',
    borderRadius: 2,
  },
  activeTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    backgroundColor: '#FF6B6B',
    borderRadius: 2,
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default RecommendedSlider; 