import React from 'react';
import {FlatList, StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Screen} from '../components/Screen';
import {colors, radius} from '../theme';

const moneyTips = Array.from({length: 6}, (_, index) => ({
  id: `tip-${index + 1}`,
  title: `Tip #${index + 1}`,
  text: 'Practical money-saving advice to help you build better financial habits.',
}));

export function TipsScreen(): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;

  return (
    <Screen scroll={false} contentStyle={[styles.screen, compact && styles.compactScreen]}>
      <Text style={[styles.heading, compact && styles.compactHeading]}>
        Money Tips
      </Text>
      <FlatList
        data={moneyTips}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <View style={[styles.card, compact && styles.compactCard]}>
            <Text style={[styles.title, compact && styles.compactTitle]}>
              {item.title}
            </Text>
            <Text style={[styles.text, compact && styles.compactText]}>
              {item.text}
            </Text>
          </View>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 24,
    paddingBottom: 0,
  },
  compactScreen: {
    paddingHorizontal: 18,
  },
  heading: {
    color: colors.white,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    marginBottom: 24,
  },
  compactHeading: {
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 148,
  },
  card: {
    minHeight: 130,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  compactCard: {
    minHeight: 104,
    padding: 16,
    marginBottom: 12,
  },
  title: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
  },
  compactTitle: {
    fontSize: 19,
    lineHeight: 24,
  },
  text: {
    color: 'rgba(245, 245, 245, 0.7)',
    fontSize: 17,
    lineHeight: 25,
    fontWeight: '600',
    marginTop: 8,
  },
  compactText: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
});
