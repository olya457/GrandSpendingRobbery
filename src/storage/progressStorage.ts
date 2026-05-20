import AsyncStorage from '@react-native-async-storage/async-storage';
import type {ProgressState} from '../types/app';

const key = 'grand-spending-robbery-progress';

export const emptyProgress: ProgressState = {
  savedTipIds: [],
  savedArticleIds: [],
  readArticleIds: [],
  quizResults: [],
  gameResults: [],
  quizScores: {},
  sortBestScore: 0,
};

const normalizeProgress = (value: Partial<ProgressState>): ProgressState => ({
  savedTipIds: Array.isArray(value.savedTipIds) ? value.savedTipIds : [],
  savedArticleIds: Array.isArray(value.savedArticleIds)
    ? value.savedArticleIds
    : [],
  readArticleIds: Array.isArray(value.readArticleIds) ? value.readArticleIds : [],
  quizResults: Array.isArray(value.quizResults) ? value.quizResults : [],
  gameResults: Array.isArray(value.gameResults) ? value.gameResults : [],
  quizScores:
    value.quizScores && typeof value.quizScores === 'object'
      ? value.quizScores
      : {},
  sortBestScore:
    typeof value.sortBestScore === 'number' ? value.sortBestScore : 0,
});

export const loadProgress = async (): Promise<ProgressState> => {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return emptyProgress;
    }

    return normalizeProgress(JSON.parse(raw));
  } catch {
    return emptyProgress;
  }
};

export const saveProgress = async (progress: ProgressState): Promise<void> => {
  await AsyncStorage.setItem(key, JSON.stringify(progress));
};

export const clearProgress = async (): Promise<void> => {
  await AsyncStorage.removeItem(key);
};
