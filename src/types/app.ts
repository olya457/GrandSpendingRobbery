import type {ImageSourcePropType} from 'react-native';

export type Article = {
  id: string;
  title: string;
  shortDescription: string;
  body: string[];
  image: ImageSourcePropType;
};

export type ResultEntry = {
  id: string;
  score: number;
  maxScore: number;
  createdAt: string;
};

export type ProgressState = {
  savedTipIds: string[];
  savedArticleIds: string[];
  readArticleIds: string[];
  quizResults: ResultEntry[];
  gameResults: ResultEntry[];
  quizScores: Record<string, number>;
  sortBestScore: number;
};
