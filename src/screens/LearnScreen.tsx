import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Screen} from '../components/Screen';
import {articles} from '../data/articles';
import {colors, radius} from '../theme';
import type {Article, ProgressState} from '../types/app';

type LearnScreenProps = {
  progress: ProgressState;
  onOpenArticle: (article: Article) => void;
  onToggleArticle: (articleId: string) => void;
};

export function LearnScreen({
  progress,
  onOpenArticle,
  onToggleArticle,
}: LearnScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;

  const shareArticle = (article: Article) => {
    Share.share({
      title: article.title,
      message: `${article.title}\n${article.shortDescription}`,
    });
  };

  return (
    <Screen scroll={false} contentStyle={[styles.screen, compact && styles.compactScreen]}>
      <Text style={[styles.heading, compact && styles.compactHeading]}>
        Financial Articles
      </Text>
      <FlatList
        data={articles}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({item}) => {
          const saved = progress.savedArticleIds.includes(item.id);
          const read = progress.readArticleIds.includes(item.id);

          return (
            <View
              style={[
                styles.card,
                compact && styles.compactCard,
                read && styles.readCard,
              ]}>
              <Pressable
                accessibilityRole="button"
                onPress={() => onOpenArticle(item)}>
                <Image
                  source={item.image}
                  style={[
                    styles.image,
                    compact && styles.compactImage,
                    read && styles.readImage,
                  ]}
                />
                {read ? (
                  <View style={styles.readPill}>
                    <Text style={styles.readText}>Read</Text>
                  </View>
                ) : null}
                <View style={[styles.titleRow, compact && styles.compactTitleRow]}>
                  <Text style={[styles.title, compact && styles.compactTitle]}>
                    {item.title}
                  </Text>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => onToggleArticle(item.id)}
                    style={styles.iconButton}>
                    <Text style={[styles.heart, saved && styles.savedHeart]}>
                      {saved ? '♥' : '♡'}
                    </Text>
                  </Pressable>
                </View>
                <Text style={[styles.description, compact && styles.compactDescription]}>
                  {item.shortDescription}
                </Text>
              </Pressable>
              <View style={[styles.actions, compact && styles.compactActions]}>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => onOpenArticle(item)}
                  style={[styles.readMore, compact && styles.compactReadMore]}>
                  <Text style={styles.readMoreText}>Read More</Text>
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => shareArticle(item)}
                  style={[styles.share, compact && styles.compactShare]}>
                  <Text style={styles.shareText}>⌯</Text>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 20,
    paddingBottom: 0,
  },
  compactScreen: {
    paddingHorizontal: 14,
  },
  heading: {
    color: colors.white,
    fontSize: 35,
    lineHeight: 40,
    fontWeight: '900',
    marginBottom: 24,
  },
  compactHeading: {
    fontSize: 29,
    lineHeight: 34,
    marginBottom: 14,
  },
  list: {
    paddingBottom: 148,
  },
  card: {
    backgroundColor: colors.panel,
    borderRadius: radius.lg,
    padding: 16,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  compactCard: {
    padding: 12,
    marginBottom: 12,
    borderRadius: radius.md,
  },
  readCard: {
    backgroundColor: '#244D38',
  },
  image: {
    width: '100%',
    height: 166,
    resizeMode: 'cover',
    borderRadius: radius.md,
    backgroundColor: colors.panelDark,
  },
  compactImage: {
    height: 118,
    borderRadius: radius.sm,
  },
  readImage: {
    opacity: 0.7,
  },
  readPill: {
    position: 'absolute',
    right: 16,
    top: 16,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  readText: {
    color: colors.ink,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  compactTitleRow: {
    marginTop: 10,
  },
  title: {
    flex: 1,
    color: colors.white,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  compactTitle: {
    fontSize: 17,
    lineHeight: 21,
  },
  iconButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    color: colors.mutedInk,
    fontSize: 33,
    lineHeight: 36,
  },
  savedHeart: {
    color: colors.red,
  },
  description: {
    color: colors.mutedInk,
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    marginTop: 8,
  },
  compactDescription: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  },
  compactActions: {
    marginTop: 12,
  },
  readMore: {
    flex: 1,
    minHeight: 50,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.green,
  },
  compactReadMore: {
    minHeight: 44,
  },
  readMoreText: {
    color: colors.ink,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '900',
  },
  share: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
    marginLeft: 12,
  },
  compactShare: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginLeft: 8,
  },
  shareText: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 30,
    fontWeight: '900',
    transform: [{rotate: '-25deg'}],
  },
});
