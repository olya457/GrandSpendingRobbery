import React, {useState} from 'react';
import {
  Image,
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

type OnboardingScreenProps = {
  onStart: () => void;
};

const slides = [
  {
    image: assets.onboardingProtect,
    title: 'Protect Your Savings',
    text: 'Learn simple habits that help keep your money safe every day.',
  },
  {
    image: assets.onboardingTraps,
    title: 'Spot Money Traps',
    text: 'Discover spending habits that slowly steal your savings.',
  },
  {
    image: assets.onboardingPlay,
    title: 'Learn Through Play',
    text: 'Complete quizzes and swipe challenges based on real financial situations.',
  },
  {
    image: assets.onboardingThink,
    title: 'Think Smarter Daily',
    text: 'Build better money habits one decision at a time.',
  },
];

export function OnboardingScreen({
  onStart,
}: OnboardingScreenProps): React.JSX.Element {
  const [index, setIndex] = useState(0);
  const {height} = useWindowDimensions();
  const compact = height < 740;
  const tiny = height < 620;
  const slide = slides[index];
  const isLast = index === slides.length - 1;

  const next = () => {
    if (isLast) {
      onStart();
      return;
    }

    setIndex(current => current + 1);
  };

  return (
    <Screen
      scroll={false}
      withNavigation={false}
      backgroundImage={assets.onboardingBackground}
      contentStyle={styles.content}>
      <Image
        source={slide.image}
        style={[
          styles.image,
          compact && styles.compactImage,
          tiny && styles.tinyImage,
        ]}
      />
      <View style={styles.copy}>
        <Text
          style={[
            styles.title,
            compact && styles.compactTitle,
            tiny && styles.tinyTitle,
          ]}>
          {slide.title}
        </Text>
        <Text
          style={[
            styles.text,
            compact && styles.compactText,
            tiny && styles.tinyText,
          ]}>
          {slide.text}
        </Text>
        <View
          style={[
            styles.dots,
            compact && styles.compactDots,
            tiny && styles.tinyDots,
          ]}>
          {slides.map((item, dotIndex) => (
            <View
              key={item.title}
              style={[styles.dot, dotIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          title={isLast ? 'Get Started' : 'Next'}
          tone="dark"
          onPress={next}
          style={tiny ? styles.tinyButton : undefined}
        />
        {!isLast ? (
          <Pressable
            accessibilityRole="button"
            onPress={onStart}
            style={[styles.skip, tiny && styles.tinySkip]}>
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: '40%',
    minHeight: 260,
    maxHeight: 340,
    resizeMode: 'contain',
    marginBottom: 24,
  },
  compactImage: {
    minHeight: 210,
    maxHeight: 260,
    marginBottom: 16,
  },
  tinyImage: {
    minHeight: 150,
    maxHeight: 180,
    marginBottom: 8,
  },
  copy: {
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 36,
    lineHeight: 41,
    fontWeight: '900',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.18)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 6,
  },
  compactTitle: {
    fontSize: 31,
    lineHeight: 35,
  },
  tinyTitle: {
    fontSize: 26,
    lineHeight: 30,
  },
  text: {
    color: colors.ink,
    fontSize: 21,
    lineHeight: 29,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 8,
  },
  compactText: {
    fontSize: 18,
    lineHeight: 24,
    marginTop: 12,
  },
  tinyText: {
    fontSize: 15,
    lineHeight: 20,
    marginTop: 8,
  },
  dots: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 28,
  },
  compactDots: {
    marginTop: 10,
    marginBottom: 16,
  },
  tinyDots: {
    height: 22,
    marginTop: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.58)',
    marginHorizontal: 5,
  },
  activeDot: {
    width: 32,
    backgroundColor: colors.white,
  },
  actions: {
    marginBottom: 8,
  },
  skip: {
    minHeight: 60,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 89, 0, 0.62)',
    marginTop: 16,
  },
  tinySkip: {
    minHeight: 46,
    marginTop: 8,
  },
  tinyButton: {
    minHeight: 46,
  },
  skipText: {
    color: colors.white,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '900',
  },
});
