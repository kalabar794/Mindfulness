export type MoodRating = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  timestamp: string;
  sessionType: string;
  before?: {
    rating: MoodRating;
    note?: string;
  };
  after?: {
    rating: MoodRating;
    note?: string;
  };
}

export const MOOD_LABELS: Record<MoodRating, string> = {
  1: 'Very Low',
  2: 'Low',
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent'
};

export const MOOD_COLORS: Record<MoodRating, string> = {
  1: '#EF4444', // red-500
  2: '#F97316', // orange-500
  3: '#EAB308', // yellow-500
  4: '#10B981', // emerald-500
  5: '#3B82F6'  // blue-500
};

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Retrieve all mood entries from localStorage
export const getAllMoodEntries = (): MoodEntry[] => {
  if (typeof window === 'undefined') {
    return [];
  }
  
  try {
    const entries = localStorage.getItem('mindfulness_mood_entries');
    return entries ? JSON.parse(entries) : [];
  } catch (error) {
    console.error('Error retrieving mood entries:', error);
    return [];
  }
};

// Add a new mood entry
export const addMoodEntry = (
  sessionType: string,
  before?: { rating: MoodRating; note?: string },
  after?: { rating: MoodRating; note?: string }
): MoodEntry => {
  const entries = getAllMoodEntries();
  
  const newEntry: MoodEntry = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    sessionType,
    before,
    after
  };
  
  const updatedEntries = [newEntry, ...entries];
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('mindfulness_mood_entries', JSON.stringify(updatedEntries));
  }
  
  return newEntry;
};

// Update an existing mood entry
export const updateMoodEntry = (entryId: string, updatedData: Partial<MoodEntry>): boolean => {
  const entries = getAllMoodEntries();
  const entryIndex = entries.findIndex(entry => entry.id === entryId);
  
  if (entryIndex === -1) {
    return false;
  }
  
  entries[entryIndex] = { ...entries[entryIndex], ...updatedData };
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('mindfulness_mood_entries', JSON.stringify(entries));
  }
  
  return true;
};

// Delete a mood entry
export const deleteMoodEntry = (entryId: string): boolean => {
  const entries = getAllMoodEntries();
  const filteredEntries = entries.filter(entry => entry.id !== entryId);
  
  if (filteredEntries.length === entries.length) {
    return false;
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem('mindfulness_mood_entries', JSON.stringify(filteredEntries));
  }
  
  return true;
};

// Get mood entries from the last N days
export const getMoodEntriesFromLastDays = (days: number, sessionType?: string): MoodEntry[] => {
  const entries = getAllMoodEntries();
  const now = new Date();
  const cutoffDate = new Date(now.setDate(now.getDate() - days));
  
  return entries.filter(entry => {
    const entryDate = new Date(entry.timestamp);
    const matchesDate = entryDate >= cutoffDate;
    const matchesType = !sessionType || entry.sessionType === sessionType;
    
    return matchesDate && matchesType;
  });
};

// Get mood trend data for charts
export const getMoodTrends = (
  days: number, 
  sessionType?: string,
  includeBeforeMood = true,
  includeAfterMood = true
) => {
  const entries = getMoodEntriesFromLastDays(days, sessionType);
  
  // Sort entries by date (oldest first)
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const labels: string[] = [];
  const beforeData: (number | null)[] = [];
  const afterData: (number | null)[] = [];
  
  sortedEntries.forEach(entry => {
    const date = new Date(entry.timestamp);
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    
    labels.push(formattedDate);
    
    if (includeBeforeMood) {
      beforeData.push(entry.before?.rating || null);
    }
    
    if (includeAfterMood) {
      afterData.push(entry.after?.rating || null);
    }
  });
  
  return { labels, beforeData, afterData };
};

// Get mood improvement stats
export const getMoodImprovementStats = (days: number, sessionType?: string) => {
  const entries = getMoodEntriesFromLastDays(days, sessionType);
  
  // Filter entries that have both before and after ratings
  const validEntries = entries.filter(entry => entry.before?.rating && entry.after?.rating);
  
  if (validEntries.length === 0) {
    return { 
      averageImprovement: 0,
      totalSessions: 0,
      lastSessionRating: 0,
      lastSessionImprovement: 0
    };
  }
  
  // Calculate average improvement
  const totalImprovement = validEntries.reduce((sum, entry) => {
    return sum + ((entry.after?.rating || 0) - (entry.before?.rating || 0));
  }, 0);
  
  const averageImprovement = totalImprovement / validEntries.length;
  
  // Get the most recent session
  const lastSession = validEntries[0];
  const lastSessionRating = lastSession.after?.rating || 0;
  const lastSessionImprovement = (lastSession.after?.rating || 0) - (lastSession.before?.rating || 0);
  
  return {
    averageImprovement,
    totalSessions: validEntries.length,
    lastSessionRating,
    lastSessionImprovement
  };
};

// Format the date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}; 