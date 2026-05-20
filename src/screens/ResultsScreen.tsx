import React, {useState} from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {colors, radius} from '../theme';
import type {ProgressState, ResultEntry} from '../types/app';
import type {MainTab} from '../navigation/types';

type ResultsScreenProps = {
  progress: ProgressState;
  onOpenTab: (tab: MainTab) => void;
};

const pad = (value: number) => String(value).padStart(2, '0');

const formatDate = (createdAt: string) => {
  const date = new Date(createdAt);

  return {
    time: `${pad(date.getHours())}:${pad(date.getMinutes())}`,
    day: `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`,
  };
};

export function ResultsScreen({
  progress,
  onOpenTab,
}: ResultsScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;
  const [mode, setMode] = useState<'quiz' | 'game'>('quiz');
  const data = mode === 'quiz' ? progress.quizResults : progress.gameResults;
  const emptyText =
    mode === 'quiz' ? 'No quiz results yet' : 'No game results yet';

  return (
    <Screen scroll={false} contentStyle={[styles.screen, compact && styles.compactScreen]}>
      <Text style={[styles.heading, compact && styles.compactHeading]}>Results</Text>
      <View style={[styles.segment, compact && styles.compactSegment]}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('quiz')}
          style={[styles.segmentItem, mode === 'quiz' && styles.quizActive]}>
          <Text
            style={[
              styles.segmentText,
              mode !== 'quiz' && styles.inactiveSegmentText,
            ]}>
            Quiz
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setMode('game')}
          style={[styles.segmentItem, mode === 'game' && styles.gameActive]}>
          <Text
            style={[
              styles.segmentText,
              mode !== 'game' && styles.inactiveSegmentText,
            ]}>
            Game
          </Text>
        </Pressable>
      </View>
      {data.length ? (
        <FlatList
          data={data}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({item}) => (
            <ResultRow item={item} mode={mode} compact={compact} />
          )}
        />
      ) : (
        <View style={styles.empty}>
          <View style={[styles.emptyIconCircle, compact && styles.compactEmptyIconCircle]}>
            <Text style={[styles.emptyIcon, compact && styles.compactEmptyIcon]}>
              {mode === 'quiz' ? '🏆' : '⚡'}
            </Text>
          </View>
          <Text style={[styles.emptyText, compact && styles.compactEmptyText]}>
            {emptyText}
          </Text>
          <PrimaryButton
            title={mode === 'quiz' ? 'Take Quiz' : 'Play Game'}
            tone={mode === 'quiz' ? 'green' : 'yellow'}
            onPress={() => onOpenTab(mode === 'quiz' ? 'quiz' : 'game')}
            style={[styles.emptyButton, compact && styles.compactEmptyButton]}
          />
        </View>
      )}
    </Screen>
  );
}

function ResultRow({
  item,
  mode,
  compact,
}: {
  item: ResultEntry;
  mode: 'quiz' | 'game';
  compact: boolean;
}): React.JSX.Element {
  const date = formatDate(item.createdAt);

  return (
    <View style={[styles.resultRow, compact && styles.compactResultRow]}>
      <View
        style={[
          styles.resultIcon,
          compact && styles.compactResultIcon,
          mode === 'game' && styles.gameIcon,
        ]}>
        <Text style={[styles.resultIconText, compact && styles.compactResultIconText]}>
          {mode === 'quiz' ? '🏆' : '⚡'}
        </Text>
      </View>
      <View style={[styles.resultCopy, compact && styles.compactResultCopy]}>
        <Text style={[styles.resultScore, compact && styles.compactResultScore]}>
          {mode === 'quiz' ? `${item.score}/${item.maxScore}` : item.score}
        </Text>
        <Text style={[styles.resultMeta, compact && styles.compactResultMeta]}>
          {`${date.day} - ${date.time}`}
        </Text>
      </View>
      <View style={[styles.badge, mode === 'game' && styles.gameBadge]}>
        <Text style={[styles.badgeText, mode === 'game' && styles.gameBadgeText]}>
          {mode === 'quiz'
            ? `${Math.round((item.score / item.maxScore) * 100)}%`
            : 'Streak'}
        </Text>
      </View>
    </View>
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
    marginBottom: 28,
  },
  compactHeading: {
    fontSize: 30,
    lineHeight: 35,
    marginBottom: 18,
  },
  segment: {
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.panelDark,
    flexDirection: 'row',
    padding: 4,
    marginBottom: 30,
  },
  compactSegment: {
    height: 46,
    marginBottom: 18,
  },
  segmentItem: {
    flex: 1,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizActive: {
    backgroundColor: colors.green,
  },
  gameActive: {
    backgroundColor: colors.yellow,
  },
  segmentText: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  inactiveSegmentText: {
    color: colors.mutedInk,
  },
  list: {
    paddingBottom: 148,
  },
  resultRow: {
    minHeight: 104,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
  },
  compactResultRow: {
    minHeight: 84,
    padding: 16,
    marginBottom: 12,
  },
  resultIcon: {
    width: 64,
    height: 64,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  compactResultIcon: {
    width: 48,
    height: 48,
  },
  gameIcon: {
    backgroundColor: colors.yellow,
  },
  resultIconText: {
    fontSize: 32,
    lineHeight: 36,
  },
  compactResultIconText: {
    fontSize: 24,
    lineHeight: 28,
  },
  resultCopy: {
    flex: 1,
    paddingHorizontal: 16,
  },
  compactResultCopy: {
    paddingHorizontal: 10,
  },
  resultScore: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '900',
  },
  compactResultScore: {
    fontSize: 22,
    lineHeight: 27,
  },
  resultMeta: {
    color: 'rgba(245, 245, 245, 0.6)',
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    marginTop: 5,
  },
  compactResultMeta: {
    fontSize: 13,
    lineHeight: 17,
  },
  badge: {
    minHeight: 34,
    borderRadius: 17,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  gameBadge: {
    backgroundColor: colors.orange,
  },
  badgeText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  gameBadgeText: {
    color: colors.white,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  compactEmptyIconCircle: {
    width: 94,
    height: 94,
    borderRadius: 47,
  },
  emptyIcon: {
    color: 'rgba(245, 245, 245, 0.3)',
    fontSize: 64,
    lineHeight: 72,
  },
  compactEmptyIcon: {
    fontSize: 46,
    lineHeight: 52,
  },
  emptyText: {
    color: colors.mutedInk,
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 22,
  },
  compactEmptyText: {
    fontSize: 17,
    lineHeight: 23,
    marginTop: 18,
    marginBottom: 18,
  },
  emptyButton: {
    minWidth: 146,
  },
  compactEmptyButton: {
    minHeight: 48,
  },
});
