type ExpressionColorKey = 
  | 'admiration' | 'amusement' | 'anger' | 'annoyance' | 'approval'
  | 'caring' | 'confusion' | 'curiosity' | 'desire' | 'disappointment'
  | 'disapproval' | 'disgust' | 'embarrassment' | 'excitement' | 'fear'
  | 'gratitude' | 'grief' | 'joy' | 'love' | 'nervousness'
  | 'optimism' | 'pride' | 'realization' | 'relief' | 'remorse'
  | 'sadness' | 'surprise' | 'neutral';

export const expressionColors: Record<ExpressionColorKey, string> = {
  admiration: "#4CAF50",
  amusement: "#FFC107",
  anger: "#F44336",
  annoyance: "#FF5722",
  approval: "#8BC34A",
  caring: "#E91E63",
  confusion: "#9C27B0",
  curiosity: "#00BCD4",
  desire: "#FF4081",
  disappointment: "#795548",
  disapproval: "#607D8B",
  disgust: "#4CAF50",
  embarrassment: "#9C27B0",
  excitement: "#FF9800",
  fear: "#673AB7",
  gratitude: "#4CAF50",
  grief: "#607D8B",
  joy: "#FFC107",
  love: "#E91E63",
  nervousness: "#9C27B0",
  optimism: "#8BC34A",
  pride: "#FF9800",
  realization: "#00BCD4",
  relief: "#4CAF50",
  remorse: "#795548",
  sadness: "#2196F3",
  surprise: "#FF9800",
  neutral: "#9E9E9E"
};

export const isExpressionColor = (color: string): color is ExpressionColorKey => {
  return color in expressionColors;
};
