import React from 'react';
import {
  Pressable,
  StyleSheet,
  type StyleProp,
  Text,
  type GestureResponderEvent,
  type ViewStyle,
} from 'react-native';
import {colors, radius} from '../theme';

type PrimaryButtonProps = {
  title: string;
  onPress: (event: GestureResponderEvent) => void;
  tone?: 'dark' | 'light' | 'green' | 'red' | 'yellow' | 'blue' | 'violet';
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export function PrimaryButton({
  title,
  onPress,
  tone = 'green',
  style,
  disabled = false,
}: PrimaryButtonProps): React.JSX.Element {
  const isLightText =
    tone === 'dark' || tone === 'red' || tone === 'blue' || tone === 'violet';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({pressed}) => [
        styles.button,
        styles[tone],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Text style={[styles.text, isLightText && styles.lightText]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  dark: {
    backgroundColor: colors.ink,
  },
  light: {
    backgroundColor: colors.panelSoft,
  },
  green: {
    backgroundColor: colors.green,
  },
  red: {
    backgroundColor: colors.red,
  },
  yellow: {
    backgroundColor: colors.yellow,
  },
  blue: {
    backgroundColor: colors.blue,
  },
  violet: {
    backgroundColor: colors.violet,
  },
  text: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  lightText: {
    color: colors.white,
  },
  pressed: {
    transform: [{scale: 0.98}],
    opacity: 0.92,
  },
  disabled: {
    opacity: 0.45,
  },
});
