// Mood data types
export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;          // Unique ID for each entry
  timestamp: number;   // When the mood was recorded
  rating: MoodRating;  // Mood rating 1-5
  note?: string;       // Optional note about mood
  sessionType?: string; // Type of session (meditation, breathing, etc.)
  isBefore: boolean;   // Whether this was recorded before or after a session
}

export interface MoodData {
  entries: MoodEntry[];
  lastUpdated: number;
}

const STORAGE_KEY = 'mindfulness-mood-data';

// Generate unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Initialize mood data from localStorage or create new
export const initMoodData = (): MoodData => {
  if (typeof window === 'undefined') {
    return { entries: [], lastUpdated: Date.now() };
  }
  
  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData) as MoodData;
    }
  } catch (error) {
    console.error('Error loading mood data from localStorage:', error);
  }
  
  // Return empty data if nothing exists yet
  return { entries: [], lastUpdated: Date.now() };
};

// Save mood data to localStorage
export const saveMoodData = (data: MoodData): void => {
  if (typeof window === 'undefined') return;
  
  try {
    data.lastUpdated = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving mood data to localStorage:', error);
  }
};

// Add a new mood entry
export const addMoodEntry = (
  rating: MoodRating,
  isBefore: boolean,
  sessionType?: string,
  note?: string
): MoodEntry => {
  const moodData = initMoodData();
  
  const newEntry: MoodEntry = {
    id: generateId(),
    timestamp: Date.now(),
    rating,
    isBefore,
    sessionType,
    note
  };
  
  moodData.entries.push(newEntry);
  saveMoodData(moodData);
  
  return newEntry;
};

// Get all mood entries
export const getAllMoodEntries = (): MoodEntry[] => {
  const moodData = initMoodData();
  return moodData.entries;
};

// Get mood entries for a specific date range
export const getMoodEntriesInRange = (startDate: Date, endDate: Date): MoodEntry[] => {
  const moodData = initMoodData();
  const startTime = startDate.getTime();
  const endTime = endDate.getTime();
  
  return moodData.entries.filter(entry => 
    entry.timestamp >= startTime && entry.timestamp <= endTime
  );
};

// Calculate average mood rating for a specific session type
export const getAverageMoodRating = (
  sessionType?: string,
  isBefore?: boolean
): number => {
  const moodData = initMoodData();
  
  let filteredEntries = moodData.entries;
  
  if (sessionType) {
    filteredEntries = filteredEntries.filter(entry => entry.sessionType === sessionType);
  }
  
  if (isBefore !== undefined) {
    filteredEntries = filteredEntries.filter(entry => entry.isBefore === isBefore);
  }
  
  if (filteredEntries.length === 0) {
    return 0;
  }
  
  const sum = filteredEntries.reduce((total, entry) => total + entry.rating, 0);
  return sum / filteredEntries.length;
};

// Get mood improvement stats (before vs after)
export const getMoodImprovementStats = (sessionType?: string): { 
  beforeAvg: number; 
  afterAvg: number; 
  improvement: number; 
  sessionCount: number;
} => {
  const beforeAvg = getAverageMoodRating(sessionType, true);
  const afterAvg = getAverageMoodRating(sessionType, false);
  
  // Calculate unique sessions by grouping timestamps (roughly same time for before/after)
  const moodData = initMoodData();
  const sessionTimestamps = new Set();
  
  moodData.entries
    .filter(entry => !sessionType || entry.sessionType === sessionType)
    .filter(entry => !entry.isBefore) // Count only after-session entries
    .forEach(entry => {
      // Round to nearest hour to group before/after pairs
      const roundedTime = Math.floor(entry.timestamp / (1000 * 60 * 60));
      sessionTimestamps.add(roundedTime);
    });
  
  return {
    beforeAvg,
    afterAvg,
    improvement: afterAvg - beforeAvg,
    sessionCount: sessionTimestamps.size
  };
};

// Get mood trends over time (array of daily averages)
export const getMoodTrends = (
  days: number,
  isBefore?: boolean
): { dates: string[]; ratings: number[] } => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - days + 1);
  startDate.setHours(0, 0, 0, 0);
  
  const entries = getMoodEntriesInRange(startDate, endDate);
  
  // Filter by before/after if specified
  const filteredEntries = isBefore !== undefined
    ? entries.filter(entry => entry.isBefore === isBefore)
    : entries;
  
  const dateRatings: Record<string, number[]> = {};
  const dates: string[] = [];
  
  // Create array of formatted dates for the range
  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    dates.push(dateStr);
    dateRatings[dateStr] = [];
  }
  
  // Group ratings by date
  filteredEntries.forEach(entry => {
    const date = new Date(entry.timestamp).toISOString().split('T')[0];
    if (dateRatings[date]) {
      dateRatings[date].push(entry.rating);
    }
  });
  
  // Calculate average for each day
  const ratings = dates.map(date => {
    const dayRatings = dateRatings[date];
    if (dayRatings.length === 0) return 0;
    return dayRatings.reduce((sum, rating) => sum + rating, 0) / dayRatings.length;
  });
  
  return { dates, ratings };
};

// Clear all mood data (for testing)
export const clearMoodData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}; 