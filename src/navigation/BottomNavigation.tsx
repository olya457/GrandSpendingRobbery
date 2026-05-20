import React from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {bottomInset} from '../components/Screen';
import {colors, navHeight} from '../theme';
import type {MainTab} from './types';

type BottomNavigationProps = {
  activeTab: MainTab;
  onChangeTab: (tab: MainTab) => void;
};

const tabs: Array<{key: MainTab; icon: string}> = [
  {key: 'articles', icon: '📰'},
  {key: 'quiz', icon: '🧠'},
  {key: 'game', icon: '♨️'},
  {key: 'tips', icon: '📖'},
  {key: 'favorites', icon: '♡'},
  {key: 'results', icon: '🏆'},
];

export function BottomNavigation({
  activeTab,
  onChangeTab,
}: BottomNavigationProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;
  const compactIos = Platform.OS === 'ios' && compact;

  return (
    <View
      style={[
        styles.wrap,
        compact ? styles.compactWrap : styles.regularWrap,
        compactIos ? styles.compactBottom : styles.regularBottom,
      ]}>
      {tabs.map(tab => {
        const active = tab.key === activeTab;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{selected: active}}
            key={tab.key}
            onPress={() => onChangeTab(tab.key)}
            style={[styles.item, compact && styles.compactItem]}>
            <Text
              style={[
                styles.icon,
                compact && styles.compactIcon,
                active && styles.activeIcon,
              ]}>
              {tab.key === 'favorites' && active ? '♥' : tab.icon}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: navHeight,
    backgroundColor: 'rgba(13, 10, 31, 0.98)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: colors.shadow,
    shadowOpacity: 0.55,
    shadowRadius: 18,
    shadowOffset: {width: 0, height: -8},
    elevation: 16,
  },
  regularWrap: {
    paddingHorizontal: 24,
  },
  compactWrap: {
    paddingHorizontal: 12,
  },
  regularBottom: {
    bottom: bottomInset,
  },
  compactBottom: {
    bottom: 18,
  },
  item: {
    width: 48,
    height: 58,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactItem: {
    width: 42,
  },
  icon: {
    color: colors.mutedInk,
    fontSize: 28,
    lineHeight: 32,
    opacity: 0.5,
  },
  activeIcon: {
    color: colors.green,
    opacity: 1,
    textShadowColor: 'rgba(118, 255, 0, 0.55)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 9,
  },
  compactIcon: {
    fontSize: 24,
    lineHeight: 28,
  },
});
