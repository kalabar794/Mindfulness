import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { MoodRating, MOOD_LABELS, MOOD_COLORS, getMoodTrends, getMoodImprovementStats } from '../../utils/moodUtils';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Default chart options for line charts
const defaultLineChartOptions: ChartOptions<'line'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      position: 'bottom' as const,
      labels: {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = context.raw as number;
          if (value === null || value === undefined) return 'No data';
          return `Mood: ${MOOD_LABELS[value as MoodRating] || value}`;
        },
        // @ts-ignore - Type issue with chart.js, but it works correctly
        labelColor: function(context) {
          const value = context.raw as number;
          if (value >= 1 && value <= 5) {
            return {
              backgroundColor: MOOD_COLORS[value as MoodRating]
            };
          }
          return {
            backgroundColor: '#CBD5E1' // slate-300
          };
        }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 5,
      ticks: {
        stepSize: 1,
        color: 'rgba(255, 255, 255, 0.6)',
        callback: function(value) {
          return MOOD_LABELS[value as MoodRating] || value;
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    x: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
};

// Default chart options for bar charts
const defaultBarChartOptions: ChartOptions<'bar'> = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = context.raw as number;
          return `Average improvement: ${value.toFixed(2)} points`;
        }
      }
    }
  },
  scales: {
    y: {
      min: -2,
      max: 4,
      ticks: {
        stepSize: 1,
        color: 'rgba(255, 255, 255, 0.6)'
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    },
    x: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.6)'
      },
      grid: {
        display: false
      }
    }
  }
};

interface MoodTrendChartProps {
  days: number;
  sessionType?: string;
  showBeforeMood?: boolean;
  showAfterMood?: boolean;
  height?: number;
}

export const MoodTrendChart: React.FC<MoodTrendChartProps> = ({
  days,
  sessionType,
  showBeforeMood = true,
  showAfterMood = true,
  height = 240
}) => {
  const { labels, beforeData, afterData } = getMoodTrends(
    days,
    sessionType,
    showBeforeMood,
    showAfterMood
  );
  
  // Format the chart data
  const data: ChartData<'line'> = {
    labels,
    datasets: [
      ...(showBeforeMood ? [{
        label: 'Before Session',
        data: beforeData,
        borderColor: '#9333EA', // purple-600
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        pointBackgroundColor: beforeData.map(val => 
          val ? MOOD_COLORS[val as MoodRating] || '#9333EA' : '#9333EA'
        ),
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        spanGaps: true
      }] : []),
      ...(showAfterMood ? [{
        label: 'After Session',
        data: afterData,
        borderColor: '#3B82F6', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        pointBackgroundColor: afterData.map(val => 
          val ? MOOD_COLORS[val as MoodRating] || '#3B82F6' : '#3B82F6'
        ),
        borderWidth: 2,
        tension: 0.3,
        fill: false,
        spanGaps: true
      }] : [])
    ]
  };
  
  return (
    <div style={{ height }}>
      <Line 
        data={data} 
        options={defaultLineChartOptions}
      />
    </div>
  );
};

interface MoodImprovementChartProps {
  days: number;
  sessionType?: string;
  height?: number;
}

export const MoodImprovementChart: React.FC<MoodImprovementChartProps> = ({
  days,
  sessionType,
  height = 240
}) => {
  const { totalSessions, averageImprovement } = getMoodImprovementStats(days, sessionType);
  
  // Helper function to get color based on improvement value
  const getColorForImprovement = (value: number): string => {
    if (value <= -1) return MOOD_COLORS[1]; // Red for negative
    if (value < 0) return MOOD_COLORS[2]; // Orange for slight negative
    if (value === 0) return MOOD_COLORS[3]; // Yellow for neutral
    if (value <= 1) return MOOD_COLORS[4]; // Green for positive
    return MOOD_COLORS[5]; // Blue for very positive
  };
  
  // Format the chart data
  const data: ChartData<'bar'> = {
    labels: ['Average Mood Improvement'],
    datasets: [
      {
        label: 'Mood Improvement',
        data: [averageImprovement],
        backgroundColor: getColorForImprovement(averageImprovement),
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderRadius: 4,
        barThickness: 40
      }
    ]
  };
  
  return (
    <div style={{ height }}>
      <Bar
        data={data}
        options={defaultBarChartOptions}
      />
      <div className="text-center mt-2 text-sm text-white text-opacity-70">
        Based on {totalSessions} {totalSessions === 1 ? 'session' : 'sessions'}
      </div>
    </div>
  );
};

interface MoodStatsProps {
  days: number;
  sessionType?: string;
}

export const MoodStats: React.FC<MoodStatsProps> = ({
  days,
  sessionType
}) => {
  const { totalSessions, averageImprovement, lastSessionRating } = getMoodImprovementStats(days, sessionType);
  
  // Format the improvement value
  const formattedImprovement = averageImprovement.toFixed(1);
  const improvementPrefix = averageImprovement > 0 ? '+' : '';
  
  // Determine class based on improvement
  let improvementClass = 'text-yellow-500'; // neutral
  if (averageImprovement > 0) improvementClass = 'text-green-500'; // positive
  if (averageImprovement < 0) improvementClass = 'text-red-500'; // negative
  
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-slate-800 bg-opacity-60 rounded-lg p-4 text-center">
        <div className="text-sm text-white text-opacity-70 mb-1">Sessions</div>
        <div className="text-2xl font-bold text-white">{totalSessions}</div>
      </div>
      
      <div className="bg-slate-800 bg-opacity-60 rounded-lg p-4 text-center">
        <div className="text-sm text-white text-opacity-70 mb-1">Avg. Improvement</div>
        <div className={`text-2xl font-bold ${improvementClass}`}>
          {improvementPrefix}{formattedImprovement}
        </div>
      </div>
      
      <div className="bg-slate-800 bg-opacity-60 rounded-lg p-4 text-center">
        <div className="text-sm text-white text-opacity-70 mb-1">Last Session</div>
        <div className="text-2xl font-bold text-white">
          {lastSessionRating ? lastSessionRating : '-'}
        </div>
      </div>
    </div>
  );
}; 