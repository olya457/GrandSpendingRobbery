import React from 'react';
import {
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  useWindowDimensions,
} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {Screen} from '../components/Screen';
import {colors, radius} from '../theme';
import type {Article} from '../types/app';

type ArticleScreenProps = {
  article: Article;
  isSaved: boolean;
  isRead: boolean;
  onBack: () => void;
  onToggleSave: () => void;
  onMarkRead: () => void;
};

export function ArticleScreen({
  article,
  isSaved,
  isRead,
  onBack,
  onToggleSave,
  onMarkRead,
}: ArticleScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;
  const shareArticle = () => {
    Share.share({
      title: article.title,
      message: `${article.title}\n${article.shortDescription}`,
    });
  };

  return (
    <Screen>
      <Pressable
        accessibilityRole="button"
        onPress={onBack}
        style={[styles.backButton, compact && styles.compactBackButton]}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>
      <Image source={article.image} style={[styles.image, compact && styles.compactImage]} />
      <Text style={[styles.title, compact && styles.compactTitle]}>{article.title}</Text>
      <Text style={[styles.body, compact && styles.compactBody]}>
        {article.body.join('\n\n')}
      </Text>
      <PrimaryButton
        title={isRead ? 'Marked as Read' : 'Mark as Read'}
        onPress={onMarkRead}
        disabled={isRead}
        style={[styles.button, compact && styles.compactButton]}
      />
      <PrimaryButton
        title={isSaved ? 'Remove from Favorites' : 'Save to Favorites'}
        tone="yellow"
        onPress={onToggleSave}
        style={[styles.button, compact && styles.compactButton]}
      />
      <PrimaryButton
        title="Share"
        tone="blue"
        onPress={shareArticle}
        style={[styles.button, compact && styles.compactButton]}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignSelf: 'flex-start',
    minHeight: 46,
    borderRadius: 23,
    backgroundColor: colors.violet,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 18,
  },
  compactBackButton: {
    minHeight: 40,
    marginBottom: 12,
  },
  backText: {
    color: colors.white,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  image: {
    width: '100%',
    height: 246,
    resizeMode: 'cover',
    borderRadius: radius.lg,
    backgroundColor: colors.panelDark,
    marginBottom: 24,
  },
  compactImage: {
    height: 156,
    marginBottom: 16,
    borderRadius: radius.md,
  },
  title: {
    color: colors.white,
    fontSize: 36,
    lineHeight: 42,
    fontWeight: '900',
  },
  compactTitle: {
    fontSize: 28,
    lineHeight: 32,
  },
  body: {
    color: colors.mutedInk,
    fontSize: 19,
    lineHeight: 29,
    fontWeight: '600',
    marginTop: 18,
  },
  compactBody: {
    fontSize: 16,
    lineHeight: 23,
    marginTop: 12,
  },
  button: {
    marginTop: 24,
  },
  compactButton: {
    marginTop: 12,
    minHeight: 48,
  },
});
