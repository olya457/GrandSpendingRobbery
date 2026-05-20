import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {assets} from '../assets';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {colors, radius} from '../theme';
import type {ProgressState} from '../types/app';

type QuizScreenProps = {
  progress: ProgressState;
  onSaveResult: (score: number, maxScore: number) => void;
  onLockedChange: (locked: boolean) => void;
};

type QuizStatement = {
  text: string;
  answer: boolean;
};

const questions: QuizStatement[] = [
  {text: 'Turning off lights when you leave a room saves money', answer: true},
  {text: 'Using credit cards for everything helps you save', answer: false},
  {text: 'Buying in bulk always saves money', answer: false},
  {text: 'Tracking your expenses helps identify wasteful spending', answer: true},
  {text: 'Brand name products are always better quality', answer: false},
  {text: 'Making coffee at home is cheaper than buying it daily', answer: true},
  {text: "You should buy something if it's on sale", answer: false},
  {text: 'Emergency funds should cover 3-6 months of expenses', answer: true},
  {text: "It's okay to max out credit cards as long as you pay minimum", answer: false},
  {text: 'Meal planning reduces food waste and saves money', answer: true},
  {text: 'All subscriptions are worth keeping', answer: false},
  {text: 'Paying yourself first means saving before spending', answer: true},
  {text: 'Impulse buying is a good financial habit', answer: false},
  {text: 'Generic brands are usually cheaper with similar quality', answer: true},
  {text: 'Shopping when hungry leads to better decisions', answer: false},
  {text: 'Unplugging devices when not in use saves electricity', answer: true},
  {text: 'You need every streaming service available', answer: false},
  {text: 'Comparing prices before buying is a waste of time', answer: false},
  {text: "Small daily purchases don't add up over time", answer: false},
  {text: 'Budgeting helps you control your spending', answer: true},
  {text: 'Eating out daily is cheaper than cooking at home', answer: false},
  {text: "Free entertainment options don't exist", answer: false},
  {text: 'Waiting 24 hours before impulse purchases helps avoid waste', answer: true},
  {text: 'Marketing emails help you save money', answer: false},
  {text: 'LED bulbs use less energy than traditional bulbs', answer: true},
  {text: 'You should buy everything new', answer: false},
  {text: 'Automated savings transfers make saving easier', answer: true},
  {text: 'Credit card rewards justify overspending', answer: false},
  {text: 'Cooking in batches saves time and money', answer: true},
  {text: 'Library cards are useless in the digital age', answer: false},
  {text: 'Setting financial goals helps you stay motivated', answer: true},
  {text: 'Checking account balances is unnecessary', answer: false},
  {text: 'Cashback apps can help you save money', answer: true},
  {text: 'All debt is bad debt', answer: false},
  {text: 'High-yield savings accounts earn more interest', answer: true},
  {text: 'You should invest before building emergency fund', answer: false},
  {text: 'Seasonal produce is usually cheaper', answer: true},
  {text: 'Pre-cut vegetables are worth the extra cost', answer: false},
  {text: 'Community events are always expensive', answer: false},
  {text: 'Celebrating small financial wins keeps you motivated', answer: true},
];

const shuffledQuestions = (size: 5 | 10) =>
  [...questions].sort(() => Math.random() - 0.5).slice(0, size);

export function QuizScreen({
  progress,
  onSaveResult,
  onLockedChange,
}: QuizScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;
  const [roundSize, setRoundSize] = useState<5 | 10 | null>(null);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [complete, setComplete] = useState(false);
  const [exitVisible, setExitVisible] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizStatement[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastResult = progress.quizResults[0];
  const current = activeQuestions[index];

  useEffect(
    () => () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    onLockedChange(Boolean(roundSize && !complete));

    return () => onLockedChange(false);
  }, [complete, onLockedChange, roundSize]);

  const reset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    setIndex(0);
    setScore(0);
    setSelected(null);
    setComplete(false);
    setExitVisible(false);
  };

  const start = (size: 5 | 10) => {
    setRoundSize(size);
    setActiveQuestions(shuffledQuestions(size));
    reset();
  };

  const finish = (finalScore: number) => {
    setComplete(true);
    onSaveResult(finalScore, activeQuestions.length);
  };

  const answer = (value: boolean) => {
    if (selected !== null || !current) {
      return;
    }

    const nextScore = value === current.answer ? score + 1 : score;
    setSelected(value);
    setScore(nextScore);
    timerRef.current = setTimeout(() => {
      if (index === activeQuestions.length - 1) {
        finish(nextScore);
        return;
      }

      setIndex(currentIndex => currentIndex + 1);
      setSelected(null);
    }, 650);
  };

  const backToSetup = () => {
    reset();
    setRoundSize(null);
  };

  if (!roundSize) {
    return (
      <Screen contentStyle={styles.setup}>
        <View style={[styles.bigIcon, compact && styles.compactBigIcon]}>
          <Text style={[styles.bigIconText, compact && styles.compactBigIconText]}>
            🧠
          </Text>
        </View>
        <Text style={[styles.heading, compact && styles.compactHeading]}>
          Financial Quiz
        </Text>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>
          Choose your round size
        </Text>
        {lastResult ? (
          <Text style={styles.lastResult}>
            Last score: {lastResult.score}/{lastResult.maxScore}
          </Text>
        ) : null}
        <PrimaryButton
          title="5 Questions"
          onPress={() => start(5)}
          style={[styles.button, compact && styles.compactButton]}
        />
        <PrimaryButton
          title="10 Questions"
          tone="yellow"
          onPress={() => start(10)}
          style={[styles.button, compact && styles.compactButton]}
        />
        <Image
          source={assets.officerChecklist}
          style={[styles.setupImage, compact && styles.compactSetupImage]}
        />
      </Screen>
    );
  }

  if (complete) {
    return (
      <Screen contentStyle={styles.complete}>
        <View style={[styles.scoreCircle, compact && styles.compactScoreCircle]}>
          <Text style={[styles.scoreCircleText, compact && styles.compactScoreCircleText]}>
            {score}
          </Text>
        </View>
        <Text style={[styles.heading, compact && styles.compactHeading]}>
          Quiz Complete!
        </Text>
        <Text style={[styles.subtitle, compact && styles.compactSubtitle]}>
          Score: {score}/{activeQuestions.length}
        </Text>
        <PrimaryButton
          title="Try Again"
          onPress={() => start(roundSize)}
          style={[styles.button, compact && styles.compactButton]}
        />
        <PrimaryButton
          title="Back"
          tone="violet"
          onPress={backToSetup}
          style={[styles.button, compact && styles.compactButton]}
        />
        <Image
          source={assets.robberMoneyBag}
          style={[styles.completeImage, compact && styles.compactCompleteImage]}
        />
      </Screen>
    );
  }

  return (
    <Screen contentStyle={styles.questionScreen}>
      <View style={styles.quizTop}>
        <Pressable
          accessibilityRole="button"
          onPress={() => setExitVisible(true)}
          style={styles.backPlain}>
          <Text style={styles.backPlainText}>Back</Text>
        </Pressable>
        <Text style={styles.count}>
          {index + 1} / {activeQuestions.length}
        </Text>
      </View>
      <View style={[styles.questionCard, compact && styles.compactQuestionCard]}>
        <Text style={[styles.questionText, compact && styles.compactQuestionText]}>
          {current.text}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={() => answer(true)}
        style={[styles.answer, compact && styles.compactAnswer, styles.trueButton]}>
        <Text style={styles.answerText}>True</Text>
        {selected !== null ? (
          <Text style={styles.answerMark}>
            {current.answer === true ? '◎' : selected === true ? '×' : ''}
          </Text>
        ) : null}
      </Pressable>
      <Pressable
        accessibilityRole="button"
        onPress={() => answer(false)}
        style={[styles.answer, compact && styles.compactAnswer, styles.falseButton]}>
        <Text style={[styles.answerText, styles.falseText]}>False</Text>
        {selected !== null ? (
          <Text style={[styles.answerMark, styles.falseText]}>
            {current.answer === false ? '◎' : selected === false ? '×' : ''}
          </Text>
        ) : null}
      </Pressable>
      <Modal transparent visible={exitVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Exit Quiz?</Text>
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
                onPress={backToSetup}
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
  setup: {
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
  },
  compactBigIcon: {
    width: 86,
    height: 86,
    borderRadius: 43,
    marginBottom: 16,
  },
  bigIconText: {
    fontSize: 38,
    lineHeight: 44,
  },
  compactBigIconText: {
    fontSize: 30,
    lineHeight: 34,
  },
  heading: {
    color: colors.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
    textAlign: 'center',
  },
  compactHeading: {
    fontSize: 26,
    lineHeight: 31,
  },
  subtitle: {
    color: colors.mutedInk,
    fontSize: 19,
    lineHeight: 25,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  compactSubtitle: {
    fontSize: 16,
    lineHeight: 21,
    marginTop: 6,
    marginBottom: 12,
  },
  lastResult: {
    color: colors.green,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '900',
    marginBottom: 6,
  },
  button: {
    alignSelf: 'stretch',
    marginTop: 12,
  },
  compactButton: {
    minHeight: 48,
    marginTop: 8,
  },
  setupImage: {
    width: 170,
    height: 210,
    resizeMode: 'contain',
    marginTop: 34,
  },
  compactSetupImage: {
    width: 118,
    height: 142,
    marginTop: 16,
  },
  questionScreen: {
    justifyContent: 'flex-start',
  },
  quizTop: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backPlain: {
    minHeight: 34,
    justifyContent: 'center',
  },
  backPlainText: {
    color: colors.mutedInk,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  count: {
    color: colors.mutedInk,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  questionCard: {
    minHeight: 144,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginBottom: 26,
  },
  compactQuestionCard: {
    minHeight: 122,
    padding: 18,
    marginBottom: 18,
  },
  questionText: {
    color: colors.white,
    fontSize: 22,
    lineHeight: 32,
    fontWeight: '700',
    textAlign: 'center',
  },
  compactQuestionText: {
    fontSize: 19,
    lineHeight: 27,
  },
  answer: {
    minHeight: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  compactAnswer: {
    minHeight: 46,
    marginBottom: 10,
  },
  trueButton: {
    backgroundColor: colors.green,
  },
  falseButton: {
    backgroundColor: colors.red,
  },
  answerText: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  falseText: {
    color: colors.white,
  },
  answerMark: {
    position: 'absolute',
    right: 16,
    color: colors.ink,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '900',
  },
  complete: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  compactScoreCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    marginBottom: 14,
  },
  scoreCircleText: {
    color: colors.ink,
    fontSize: 47,
    lineHeight: 54,
    fontWeight: '900',
  },
  compactScoreCircleText: {
    fontSize: 40,
    lineHeight: 46,
  },
  completeImage: {
    width: 182,
    height: 196,
    resizeMode: 'contain',
    marginTop: 26,
  },
  compactCompleteImage: {
    width: 126,
    height: 136,
    marginTop: 14,
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(9, 4, 21, 0.72)',
  },
  modalCard: {
    width: '58%',
    minHeight: 164,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
  },
  modalTitle: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  modalText: {
    color: colors.mutedInk,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '700',
    marginTop: 10,
    marginBottom: 16,
  },
  modalActions: {
    flexDirection: 'row',
  },
  modalButton: {
    minHeight: 40,
    flex: 1,
    marginHorizontal: 4,
  },
});
