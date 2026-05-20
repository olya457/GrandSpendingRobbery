import React, {useEffect, useMemo, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {ArticleScreen} from '../screens/ArticleScreen';
import {FavoritesScreen} from '../screens/FavoritesScreen';
import {LearnScreen} from '../screens/LearnScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {QuizScreen} from '../screens/QuizScreen';
import {ResultsScreen} from '../screens/ResultsScreen';
import {SortScreen} from '../screens/SortScreen';
import {SplashScreen} from '../screens/SplashScreen';
import {TipsScreen} from '../screens/TipsScreen';
import {
  clearProgress,
  emptyProgress,
  loadProgress,
  saveProgress,
} from '../storage/progressStorage';
import type {Article, ProgressState, ResultEntry} from '../types/app';
import {BottomNavigation} from './BottomNavigation';
import type {MainTab} from './types';

type Stage = 'splash' | 'onboarding' | 'main';

const createResult = (score: number, maxScore: number): ResultEntry => ({
  id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
  score,
  maxScore,
  createdAt: new Date().toISOString(),
});

export function AppNavigator(): React.JSX.Element {
  const [stage, setStage] = useState<Stage>('splash');
  const [activeTab, setActiveTab] = useState<MainTab>('articles');
  const [article, setArticle] = useState<Article | null>(null);
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);
  const [quizLocked, setQuizLocked] = useState(false);
  const [gameLocked, setGameLocked] = useState(false);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const updateProgress = (recipe: (current: ProgressState) => ProgressState) => {
    setProgress(current => {
      const next = recipe(current);
      saveProgress(next);
      return next;
    });
  };

  const progressActions = useMemo(
    () => ({
      toggleTip: (tipId: string) =>
        updateProgress(current => {
          const savedTipIds = current.savedTipIds.includes(tipId)
            ? current.savedTipIds.filter(id => id !== tipId)
            : [...current.savedTipIds, tipId];

          return {...current, savedTipIds};
        }),
      toggleArticle: (articleId: string) =>
        updateProgress(current => {
          const savedArticleIds = current.savedArticleIds.includes(articleId)
            ? current.savedArticleIds.filter(id => id !== articleId)
            : [...current.savedArticleIds, articleId];

          return {...current, savedArticleIds};
        }),
      markArticleRead: (articleId: string) =>
        updateProgress(current => ({
          ...current,
          readArticleIds: current.readArticleIds.includes(articleId)
            ? current.readArticleIds
            : [...current.readArticleIds, articleId],
        })),
      saveQuizResult: (score: number, maxScore: number) =>
        updateProgress(current => ({
          ...current,
          quizResults: [createResult(score, maxScore), ...current.quizResults].slice(0, 20),
        })),
      saveGameResult: (score: number, maxScore: number) =>
        updateProgress(current => ({
          ...current,
          gameResults: [createResult(score, maxScore), ...current.gameResults].slice(0, 20),
          sortBestScore: Math.max(current.sortBestScore, score),
        })),
      clear: async () => {
        await clearProgress();
        setProgress(emptyProgress);
      },
    }),
    [],
  );

  const openArticle = (nextArticle: Article) => {
    setArticle(nextArticle);
  };

  const showMainTab = (tab: MainTab) => {
    if (tab !== activeTab && activeTab === 'quiz' && quizLocked) {
      Alert.alert('Exit Quiz?', 'Your progress will be lost', [
        {text: 'Continue', style: 'cancel'},
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            setArticle(null);
            setActiveTab(tab);
          },
        },
      ]);
      return;
    }

    if (tab !== activeTab && activeTab === 'game' && gameLocked) {
      Alert.alert('Exit Game?', 'Your progress will be lost', [
        {text: 'Continue', style: 'cancel'},
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            setArticle(null);
            setActiveTab(tab);
          },
        },
      ]);
      return;
    }

    setArticle(null);
    setActiveTab(tab);
  };

  if (stage === 'splash') {
    return <SplashScreen onDone={() => setStage('onboarding')} />;
  }

  if (stage === 'onboarding') {
    return <OnboardingScreen onStart={() => setStage('main')} />;
  }

  return (
    <View style={styles.root}>
      {article ? (
        <ArticleScreen
          article={article}
          isSaved={progress.savedArticleIds.includes(article.id)}
          isRead={progress.readArticleIds.includes(article.id)}
          onBack={() => setArticle(null)}
          onToggleSave={() => progressActions.toggleArticle(article.id)}
          onMarkRead={() => progressActions.markArticleRead(article.id)}
        />
      ) : activeTab === 'articles' ? (
        <LearnScreen
          progress={progress}
          onOpenArticle={openArticle}
          onToggleArticle={progressActions.toggleArticle}
        />
      ) : activeTab === 'quiz' ? (
        <QuizScreen
          progress={progress}
          onSaveResult={progressActions.saveQuizResult}
          onLockedChange={setQuizLocked}
        />
      ) : activeTab === 'game' ? (
        <SortScreen
          bestScore={progress.sortBestScore}
          onSaveResult={progressActions.saveGameResult}
          onLockedChange={setGameLocked}
        />
      ) : activeTab === 'tips' ? (
        <TipsScreen />
      ) : activeTab === 'favorites' ? (
        <FavoritesScreen
          progress={progress}
          onExplore={() => showMainTab('articles')}
          onOpenArticle={openArticle}
          onToggleArticle={progressActions.toggleArticle}
        />
      ) : (
        <ResultsScreen progress={progress} onOpenTab={showMainTab} />
      )}
      <BottomNavigation activeTab={activeTab} onChangeTab={showMainTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
