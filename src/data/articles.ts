import {assets} from '../assets';
import type {Article} from '../types/app';

export const articles: Article[] = [
  {
    id: 'electricity-bills',
    title: 'Save on Electricity Bills',
    shortDescription: 'Simple daily habits to reduce your energy costs',
    image: assets.articleSavingEnergy,
    body: [
      'Turn off lights when leaving rooms. Unplug chargers and devices when not in use. Use energy-efficient LED bulbs. Set your thermostat a few degrees lower in winter and higher in summer. These small changes can save hundreds annually.',
    ],
  },
  {
    id: 'impulse-purchases',
    title: 'Avoid Impulse Purchases',
    shortDescription: 'Strategies to stop buying things you don\'t need',
    image: assets.articleImpulseBuying,
    body: [
      'Wait 24 hours before buying non-essential items. Make shopping lists and stick to them. Unsubscribe from marketing emails. Ask yourself if you really need it or just want it. Track your spending to see patterns.',
    ],
  },
  {
    id: 'budget-habits',
    title: 'Smart Budget Habits',
    shortDescription: 'Create a budget that actually works',
    image: assets.articleDailyBudget,
    body: [
      'Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Track every expense for one month. Set realistic limits. Review and adjust monthly. Automate savings transfers.',
    ],
  },
  {
    id: 'daily-spending-awareness',
    title: 'Daily Spending Awareness',
    shortDescription: 'How small purchases add up over time',
    image: assets.articleSmartSpending,
    body: [
      'That daily coffee costs $1,825 per year. Track small purchases in a notebook or app. Calculate annual costs of daily habits. Find free alternatives. Pack lunch instead of eating out.',
    ],
  },
  {
    id: 'smart-shopping',
    title: 'Smart Shopping Tips',
    shortDescription: 'Get more value for every dollar spent',
    image: assets.articleShoppingPlans,
    body: [
      'Compare prices before buying. Use coupons and cashback apps. Buy generic brands. Shop with a list. Avoid shopping when hungry or emotional. Wait for sales on big purchases.',
    ],
  },
  {
    id: 'saving-habits',
    title: 'Basic Saving Habits',
    shortDescription: 'Build wealth with simple daily actions',
    image: assets.articleSavingsHabits,
    body: [
      'Pay yourself first by saving before spending. Start with even 5% of income. Use high-yield savings accounts. Set up automatic transfers. Keep emergency fund of 3-6 months expenses.',
    ],
  },
  {
    id: 'subscription-costs',
    title: 'Cut Subscription Costs',
    shortDescription: 'Stop paying for services you don\'t use',
    image: assets.articleSpendingTraps,
    body: [
      'Review all monthly subscriptions. Cancel unused services. Share family plans with others. Rotate streaming services instead of keeping all. Check for free alternatives.',
    ],
  },
  {
    id: 'meal-planning',
    title: 'Meal Planning Saves Money',
    shortDescription: 'Reduce food waste and eating out expenses',
    image: assets.articleBetterPlanning,
    body: [
      'Plan weekly meals before shopping. Cook in batches and freeze portions. Use leftovers creatively. Buy seasonal produce. Avoid pre-cut or pre-made items that cost more.',
    ],
  },
  {
    id: 'free-entertainment',
    title: 'Free Entertainment Ideas',
    shortDescription: 'Have fun without spending money',
    image: assets.articleSmartChoices,
    body: [
      'Visit free museums and parks. Use library for books and movies. Host potluck dinners with friends. Enjoy free community events. Explore hiking trails. Have game nights at home.',
    ],
  },
  {
    id: 'track-progress',
    title: 'Track Your Progress',
    shortDescription: 'Measure and celebrate your financial wins',
    image: assets.articleSmallSavings,
    body: [
      'Keep a spending journal. Set monthly savings goals. Celebrate milestones. Use apps to visualize progress. Review finances weekly. Adjust strategies based on what works.',
    ],
  },
];
