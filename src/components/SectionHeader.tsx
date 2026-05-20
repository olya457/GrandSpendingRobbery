import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {colors} from '../theme';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: SectionHeaderProps): React.JSX.Element {
  return (
    <View style={styles.wrap}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 24,
  },
  eyebrow: {
    color: colors.green,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
    opacity: 0.72,
  },
  title: {
    color: colors.white,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    marginTop: 4,
  },
  subtitle: {
    color: colors.mutedInk,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    marginTop: 8,
  },
});
