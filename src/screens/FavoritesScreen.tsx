import React from 'react';
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
import {articles} from '../data/articles';
import {colors, radius} from '../theme';
import type {Article, ProgressState} from '../types/app';

type FavoritesScreenProps = {
  progress: ProgressState;
  onExplore: () => void;
  onOpenArticle: (article: Article) => void;
  onToggleArticle: (articleId: string) => void;
};

export function FavoritesScreen({
  progress,
  onExplore,
  onOpenArticle,
  onToggleArticle,
}: FavoritesScreenProps): React.JSX.Element {
  const {height, width} = useWindowDimensions();
  const compact = height < 700 || width <= 375;
  const favoriteArticles = articles.filter(article =>
    progress.savedArticleIds.includes(article.id),
  );

  if (!favoriteArticles.length) {
    return (
      <Screen contentStyle={styles.emptyScreen}>
        <View style={[styles.emptyHeart, compact && styles.compactEmptyHeart]}>
          <Text style={[styles.emptyHeartText, compact && styles.compactEmptyHeartText]}>
            ♡
          </Text>
        </View>
        <Text style={[styles.emptyTitle, compact && styles.compactEmptyTitle]}>
          No Favorites Yet
        </Text>
        <Text style={[styles.emptyText, compact && styles.compactEmptyText]}>
          Save articles and tips to access them quickly here
        </Text>
        <PrimaryButton
          title="Explore"
          onPress={onExplore}
          style={[styles.explore, compact && styles.compactExplore]}
        />
      </Screen>
    );
  }

  return (
    <Screen scroll={false} contentStyle={[styles.screen, compact && styles.compactScreen]}>
      <Text style={[styles.heading, compact && styles.compactHeading]}>Favorites</Text>
      <FlatList
        data={favoriteArticles}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        renderItem={({item}) => (
          <Pressable
            accessibilityRole="button"
            onPress={() => onOpenArticle(item)}
            style={[styles.card, compact && styles.compactCard]}>
            <View style={[styles.iconCircle, compact && styles.compactIconCircle]}>
              <Text style={styles.iconText}>💡</Text>
            </View>
            <View style={styles.copy}>
              <Text style={[styles.title, compact && styles.compactTitle]}>
                {item.title}
              </Text>
              <Text style={[styles.text, compact && styles.compactText]}>
                {item.shortDescription}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              onPress={event => {
                event.stopPropagation();
                onToggleArticle(item.id);
              }}
              style={styles.heartButton}>
              <Text style={styles.heart}>♥</Text>
            </Pressable>
          </Pressable>
        )}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  emptyScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyHeart: {
    width: 128,
    height: 128,
    borderRadius: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panel,
    marginBottom: 28,
  },
  compactEmptyHeart: {
    width: 94,
    height: 94,
    borderRadius: 47,
    marginBottom: 18,
  },
  emptyHeartText: {
    color: colors.mutedInk,
    fontSize: 86,
    lineHeight: 92,
  },
  compactEmptyHeartText: {
    fontSize: 62,
    lineHeight: 68,
  },
  emptyTitle: {
    color: colors.white,
    fontSize: 35,
    lineHeight: 40,
    fontWeight: '900',
    textAlign: 'center',
  },
  compactEmptyTitle: {
    fontSize: 29,
    lineHeight: 34,
  },
  emptyText: {
    color: colors.mutedInk,
    fontSize: 21,
    lineHeight: 29,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 310,
  },
  compactEmptyText: {
    fontSize: 17,
    lineHeight: 23,
    maxWidth: 270,
  },
  explore: {
    minWidth: 126,
    marginTop: 30,
  },
  compactExplore: {
    minHeight: 48,
    marginTop: 20,
  },
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
    minHeight: 132,
    borderRadius: radius.lg,
    backgroundColor: colors.panel,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOpacity: 0.24,
    shadowRadius: 14,
    shadowOffset: {width: 0, height: 8},
    elevation: 8,
  },
  compactCard: {
    minHeight: 102,
    padding: 16,
    marginBottom: 12,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconText: {
    fontSize: 24,
    lineHeight: 28,
  },
  copy: {
    flex: 1,
    paddingHorizontal: 14,
  },
  title: {
    color: colors.white,
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  compactTitle: {
    fontSize: 17,
    lineHeight: 21,
  },
  text: {
    color: colors.mutedInk,
    fontSize: 16,
    lineHeight: 23,
    fontWeight: '600',
    marginTop: 8,
  },
  compactText: {
    fontSize: 14,
    lineHeight: 19,
    marginTop: 4,
  },
  heartButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heart: {
    color: colors.red,
    fontSize: 32,
    lineHeight: 36,
  },
});
