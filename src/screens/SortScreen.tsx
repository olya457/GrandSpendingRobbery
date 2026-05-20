import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {colors, radius} from '../theme';

type SortScreenProps = {
  bestScore: number;
  onSaveResult: (score: number, maxScore: number) => void;
  onLockedChange: (locked: boolean) => void;
};

type GameStatement = {
  text: string;
  type: 'save' | 'waste';
};

const gameStatements: GameStatement[] = [
  {text: 'Turn off lights when leaving a room', type: 'save'},
  {text: 'Buy things you don\'t need on sale', type: 'waste'},
  {text: 'Leave chargers plugged in all the time', type: 'waste'},
  {text: 'Cook at home instead of ordering daily', type: 'save'},
  {text: 'Use cashback apps when shopping', type: 'save'},
  {text: 'Max out credit cards monthly', type: 'waste'},
  {text: 'Pack lunch for work', type: 'save'},
  {text: 'Subscribe to all streaming services', type: 'waste'},
  {text: 'Compare prices before buying', type: 'save'},
  {text: 'Shop when you\'re hungry', type: 'waste'},
  {text: 'Use energy-efficient LED bulbs', type: 'save'},
  {text: 'Buy coffee at cafes every day', type: 'waste'},
  {text: 'Plan meals before grocery shopping', type: 'save'},
  {text: 'Ignore bank account balance', type: 'waste'},
  {text: 'Use public library for books', type: 'save'},
  {text: 'Pay only minimum on credit cards', type: 'waste'},
  {text: 'Buy generic brands when quality is similar', type: 'save'},
  {text: 'Keep unused subscriptions running', type: 'waste'},
  {text: 'Set up automatic savings transfers', type: 'save'},
  {text: 'Upgrade phone every year', type: 'waste'},
  {text: 'Use reusable water bottle', type: 'save'},
  {text: 'Eat out for every meal', type: 'waste'},
  {text: 'Wait 24 hours before impulse purchases', type: 'save'},
  {text: 'Buy extended warranties on everything', type: 'waste'},
  {text: 'Unplug devices when not in use', type: 'save'},
  {text: 'Keep all marketing emails', type: 'waste'},
  {text: 'Batch cook and freeze meals', type: 'save'},
  {text: 'Replace working items with new ones', type: 'waste'},
  {text: 'Use coupons and discount codes', type: 'save'},
  {text: 'Shop for fun when bored', type: 'waste'},
];

const shuffleGame = () => [...gameStatements].sort(() => Math.random() - 0.5);

export function SortScreen({
  bestScore,
  onSaveResult,
  onLockedChange,
}: SortScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;
  const [started, setStarted] = useState(false);
  const [deck, setDeck] = useState<GameStatement[]>([]);
  const [index, setIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [locked, setLocked] = useState(false);
  const position = useRef(new Animated.ValueXY()).current;
  const current = deck[index];
  const rotate = position.x.interpolate({
    inputRange: [-220, 0, 220],
    outputRange: ['-15deg', '0deg', '15deg'],
    extrapolate: 'clamp',
  });

  useEffect(() => {
    onLockedChange(started && !gameOver);

    return () => onLockedChange(false);
  }, [gameOver, onLockedChange, started]);

  const reset = () => {
    position.setValue({x: 0, y: 0});
    setIndex(0);
    setStreak(0);
    setGameOver(false);
    setExitVisible(false);
    setLocked(false);
  };

  const startGame = () => {
    setDeck(shuffleGame());
    reset();
    setStarted(true);
  };

  const endGame = (score: number) => {
    setGameOver(true);
    setLocked(false);
    onSaveResult(score, gameStatements.length);
  };

  const choose = (type: 'save' | 'waste') => {
    if (!current || locked || gameOver) {
      return;
    }

    setLocked(true);
    const correct = type === current.type;
    const nextStreak = correct ? streak + 1 : streak;
    Animated.timing(position, {
      toValue: {x: type === 'save' ? 420 : -420, y: 0},
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      position.setValue({x: 0, y: 0});

      if (!correct || index === deck.length - 1) {
        endGame(nextStreak);
        return;
      }

      setStreak(nextStreak);
      setIndex(currentIndex => currentIndex + 1);
      setLocked(false);
    });
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 12,
    onPanResponderMove: Animated.event(
      [null, {dx: position.x, dy: position.y}],
      {useNativeDriver: false},
    ),
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx > 110) {
        choose('save');
        return;
      }

      if (gesture.dx < -110) {
        choose('waste');
        return;
      }

      Animated.spring(position, {
        toValue: {x: 0, y: 0},
        useNativeDriver: true,
      }).start();
    },
  });

  const backToStart = () => {
    reset();
    setStarted(false);
  };

  if (!started) {
    return (
      <Screen contentStyle={styles.start}>
        <View style={[styles.bigIcon, compact && styles.compactBigIcon]}>
          <Text style={[styles.bigIconText, compact && styles.compactBigIconText]}>
            ♨️
          </Text>
        </View>
        <Text style={[styles.heading, compact && styles.compactHeading]}>
          Swipe Game
        </Text>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>
          Choose wisely for each financial habit
        </Text>
        <Text style={[styles.ruleSave, compact && styles.compactRule]}>
          Saves Money = Police protect your savings
        </Text>
        <Text style={[styles.ruleWaste, compact && styles.compactRule]}>
          Wastes Money = Thief steals your money
        </Text>
        <PrimaryButton
          title="Start Game"
          onPress={startGame}
          style={[styles.startButton, compact && styles.compactButton]}
        />
      </Screen>
    );
  }

  if (gameOver) {
    return (
      <Screen contentStyle={styles.over}>
        <View style={[styles.scoreCircle, compact && styles.compactScoreCircle]}>
          <Text style={[styles.scoreCircleText, compact && styles.compactScoreText]}>
            {streak}
          </Text>
        </View>
        <Text style={[styles.heading, compact && styles.compactHeading]}>
          Game Over!
        </Text>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>
          Streak: {streak}
        </Text>
        <PrimaryButton
          title="Play Again"
          onPress={startGame}
          style={[styles.button, compact && styles.compactButton]}
        />
        <PrimaryButton
          title="Back"
          tone="violet"
          onPress={backToStart}
          style={[styles.button, compact && styles.compactButton]}
        />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.game}>
      <View style={[styles.gameTop, compact && styles.compactGameTop]}>
        <Text style={[styles.streak, compact && styles.compactStreak]}>
          Streak: {streak}
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setExitVisible(true)}
          style={styles.exitSmall}>
          <Text style={styles.exitSmallText}>Exit</Text>
        </Pressable>
      </View>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          styles.decisionCard,
          compact && styles.compactDecisionCard,
          {
            transform: [
              {translateX: position.x},
              {translateY: position.y},
              {rotate},
              {
                scale: position.x.interpolate({
                  inputRange: [-420, 0, 420],
                  outputRange: [0.9, 1, 0.9],
                  extrapolate: 'clamp',
                }),
              },
            ],
            opacity: position.x.interpolate({
              inputRange: [-420, 0, 420],
              outputRange: [0, 1, 0],
              extrapolate: 'clamp',
            }),
          },
        ]}>
        <Text style={[styles.leftHint, compact && styles.compactHint]}>← Thief</Text>
        <Text style={[styles.rightHint, compact && styles.compactHint]}>Police →</Text>
        <Text style={[styles.decisionText, compact && styles.compactDecisionText]}>
          {current?.text}
        </Text>
      </Animated.View>
      <View style={[styles.actions, compact && styles.compactActions]}>
        <PrimaryButton
          title="Wastes Money"
          tone="red"
          onPress={() => choose('waste')}
          style={[styles.actionButton, compact && styles.compactButton]}
        />
        <PrimaryButton
          title="Saves Money"
          onPress={() => choose('save')}
          style={[styles.actionButton, compact && styles.compactButton]}
        />
      </View>
      <Text style={styles.best}>Best streak: {bestScore}</Text>
      <Modal transparent visible={exitVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Exit Game?</Text>
            <Text style={styles.modalText}>Your progress will be lost</Text>
            <View style={styles.modalActions}>
              <PrimaryButton
                title="Continue"
                onPress={() => setExitVisible(false)}
                style={styles.modalButton}
              />
              <PrimaryButton
                title="Exit"
                tone="red"
                onPress={backToStart}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  start: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigIcon: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
    marginBottom: 28,
    shadowColor: colors.green,
    shadowOpacity: 0.3,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 12},
    elevation: 14,
  },
  compactBigIcon: {
    width: 92,
    height: 92,
    borderRadius: 46,
    marginBottom: 16,
  },
  bigIconText: {
    color: colors.ink,
    fontSize: 56,
    lineHeight: 62,
  },
  compactBigIconText: {
    fontSize: 42,
    lineHeight: 48,
  },
  heading: {
    color: colors.white,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
    textAlign: 'center',
  },
  compactHeading: {
    fontSize: 29,
    lineHeight: 34,
  },
  subtitle: {
    color: 'rgba(245, 245, 245, 0.85)',
    fontSize: 20,
    lineHeight: 27,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
  },
  compactSubtitle: {
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
  ruleSave: {
    color: colors.green,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    marginTop: 22,
    textAlign: 'center',
  },
  compactRule: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 12,
  },
  ruleWaste: {
    color: colors.red,
    fontSize: 17,
    lineHeight: 23,
    fontWeight: '700',
    marginTop: 7,
    textAlign: 'center',
  },
  startButton: {
    alignSelf: 'stretch',
    marginTop: 32,
  },
  game: {
    justifyContent: 'flex-start',
  },
  gameTop: {
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 56,
  },
  compactGameTop: {
    marginBottom: 24,
  },
  streak: {
    color: colors.white,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
  },
  compactStreak: {
    fontSize: 20,
    lineHeight: 25,
  },
  exitSmall: {
    minHeight: 36,
    borderRadius: 18,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  exitSmallText: {
    color: colors.white,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '900',
  },
  decisionCard: {
    minHeight: 250,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    shadowColor: colors.shadow,
    shadowOpacity: 0.38,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 14},
    elevation: 14,
  },
  compactDecisionCard: {
    minHeight: 186,
    padding: 24,
  },
  decisionText: {
    color: colors.white,
    fontSize: 25,
    lineHeight: 35,
    fontWeight: '800',
    textAlign: 'center',
  },
  compactDecisionText: {
    fontSize: 20,
    lineHeight: 28,
  },
  leftHint: {
    position: 'absolute',
    left: 18,
    top: 18,
    color: 'rgba(255, 59, 59, 0.4)',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },
  rightHint: {
    position: 'absolute',
    right: 18,
    top: 18,
    color: 'rgba(127, 255, 0, 0.4)',
    fontSize: 17,
    lineHeight: 22,
    fontWeight: '900',
  },
  compactHint: {
    fontSize: 13,
    lineHeight: 17,
    top: 12,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 32,
  },
  compactActions: {
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
  },
  best: {
    color: colors.mutedInk,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 18,
  },
  over: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.yellow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: colors.yellow,
    shadowOpacity: 0.28,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 12},
    elevation: 14,
  },
  compactScoreCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    marginBottom: 14,
  },
  scoreCircleText: {
    color: colors.ink,
    fontSize: 56,
    lineHeight: 64,
    fontWeight: '900',
  },
  compactScoreText: {
    fontSize: 42,
    lineHeight: 48,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  compactButton: {
    minHeight: 48,
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9, 4, 21, 0.72)',
  },
  modalCard: {
    width: '64%',
    minHeight: 174,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    shadowColor: colors.shadow,
    shadowOpacity: 0.42,
    shadowRadius: 22,
    shadowOffset: {width: 0, height: 14},
    elevation: 16,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: '900',
  },
  modalText: {
    color: 'rgba(245, 245, 245, 0.8)',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 18,
  },
  modalActions: {
    flexDirection: 'row',
  },
  modalButton: {
    minHeight: 42,
    flex: 1,
    marginHorizontal: 5,
  },
});
