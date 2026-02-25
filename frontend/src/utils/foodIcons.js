/**
 * Food Icons & Category Mapping Utility
 * Maps food categories and specific food names to emojis and colors
 */

// Category display config — emoji, label, color
export const CATEGORY_CONFIG = {
  ALL:        { emoji: '🍱', label: 'All Foods',   color: '#6366f1' },
  GRAIN:      { emoji: '🌾', label: 'Grains',      color: '#d97706' },
  PROTEIN:    { emoji: '🍗', label: 'Protein',     color: '#dc2626' },
  VEGETABLE:  { emoji: '🥬', label: 'Vegetables',  color: '#16a34a' },
  LEGUME:     { emoji: '🫘', label: 'Legumes',     color: '#92400e' },
  DAIRY:      { emoji: '🥛', label: 'Dairy',       color: '#2563eb' },
  FRUIT:      { emoji: '🍎', label: 'Fruits',      color: '#e11d48' },
  SNACK:      { emoji: '🍿', label: 'Snacks',      color: '#f59e0b' },
  BEVERAGE:   { emoji: '☕', label: 'Beverages',   color: '#7c3aed' },
  DESSERT:    { emoji: '🍮', label: 'Desserts',    color: '#ec4899' },
  NUT_SEED:   { emoji: '🥜', label: 'Nuts & Seeds', color: '#78716c' },
  OTHER:      { emoji: '🍽️', label: 'Other',       color: '#64748b' },
}

// Food name → emoji mapping (partial match, case-insensitive)
const FOOD_EMOJI_MAP = [
  // Breads & Grains
  [/roti|chapati|phulka/i,     '🫓'],
  [/naan|kulcha/i,             '🫓'],
  [/paratha|parantha/i,        '🫓'],
  [/puri|poori|bhatura/i,      '🫓'],
  [/dosa|dosai/i,              '🥞'],
  [/idli/i,                    '🥟'],
  [/uttapam|uttappam/i,        '🥞'],
  [/vada|vadai|medu/i,         '🍩'],
  [/upma/i,                    '🥣'],
  [/poha|avalakki/i,           '🍚'],
  [/rice|chawal|pulao|biryani/i, '🍚'],
  [/khichdi/i,                 '🍚'],
  [/pongal/i,                  '🍚'],

  // Dals & Legumes
  [/dal|daal|sambar/i,         '🥘'],
  [/rajma/i,                   '🫘'],
  [/chole|chana|chickpea/i,    '🫘'],
  [/lentil/i,                  '🫘'],

  // Curries & Main dishes
  [/paneer/i,                  '🧀'],
  [/butter chicken|murgh/i,    '🍛'],
  [/chicken/i,                 '🍗'],
  [/mutton|lamb|keema/i,       '🥩'],
  [/fish|meen|machli/i,        '🐟'],
  [/egg|anda|omelette/i,       '🥚'],
  [/prawn|shrimp/i,            '🦐'],
  [/curry|masala|korma|tikka/i, '🍛'],
  [/biryani/i,                 '🍛'],
  [/palak|saag|spinach/i,      '🥬'],
  [/aloo|potato/i,             '🥔'],
  [/gobi|cauliflower/i,        '🥦'],
  [/bhindi|okra|ladies/i,      '🫑'],
  [/baingan|brinjal|eggplant/i, '🍆'],
  [/raita/i,                   '🥛'],

  // Snacks
  [/samosa/i,                  '🥟'],
  [/pakora|pakoda|bhaji/i,     '🧆'],
  [/bonda|bonda/i,             '🧆'],
  [/pungulu/i,                 '🧆'],
  [/chaat|bhel/i,              '🥗'],
  [/papad|papadum/i,           '🥏'],

  // Beverages
  [/chai|tea/i,                '☕'],
  [/coffee|kaapi/i,            '☕'],
  [/lassi/i,                   '🥛'],
  [/buttermilk|chaas|majjiga/i, '🥛'],
  [/juice/i,                   '🧃'],

  // Desserts & Sweets
  [/gulab|jamun/i,             '🍮'],
  [/kheer|payasam/i,           '🍮'],
  [/halwa|halva/i,             '🍮'],
  [/laddu|ladoo/i,             '🍡'],
  [/jalebi/i,                  '🍩'],
  [/barfi|burfi/i,             '🍬'],
  [/rasgulla/i,                '⚪'],
  [/sweet|mithai/i,            '🍬'],

  // Fruits
  [/mango|aam/i,               '🥭'],
  [/banana|kela/i,             '🍌'],
  [/apple/i,                   '🍎'],
  [/orange/i,                  '🍊'],
  [/grape/i,                   '🍇'],
  [/coconut|nariyal/i,         '🥥'],
  [/papaya/i,                  '🥭'],

  // Dairy
  [/curd|yogurt|dahi/i,        '🥛'],
  [/ghee/i,                    '🧈'],
  [/milk|dudh/i,               '🥛'],

  // Pickles & condiments
  [/pickle|achar/i,            '🫙'],
  [/chutney/i,                 '🫙'],
]

/**
 * Get emoji for a specific food item by name
 */
export function getFoodEmoji(name, category) {
  if (!name) return getCategoryEmoji(category)
  
  for (const [pattern, emoji] of FOOD_EMOJI_MAP) {
    if (pattern.test(name)) return emoji
  }
  
  // Fallback to category emoji
  return getCategoryEmoji(category)
}

/**
 * Get emoji for a food category
 */
export function getCategoryEmoji(category) {
  return CATEGORY_CONFIG[category]?.emoji || '🍽️'
}

/**
 * Get color for a food category
 */
export function getCategoryColor(category) {
  return CATEGORY_CONFIG[category]?.color || '#64748b'
}

/**
 * Get display label for a food category
 */
export function getCategoryLabel(category) {
  return CATEGORY_CONFIG[category]?.label || category
}

/**
 * Meal type config — emoji, label, color
 */
export const MEAL_TYPE_CONFIG = {
  BREAKFAST: { emoji: '🌅', label: 'Breakfast', color: '#f59e0b', bg: '#fef3c7' },
  LUNCH:     { emoji: '☀️', label: 'Lunch',     color: '#2563eb', bg: '#dbeafe' },
  DINNER:    { emoji: '🌙', label: 'Dinner',    color: '#7c3aed', bg: '#ede9fe' },
  SNACK:     { emoji: '🍪', label: 'Snack',     color: '#059669', bg: '#d1fae5' },
}
