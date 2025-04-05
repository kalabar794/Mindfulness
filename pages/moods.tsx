import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MoodDashboard from '../components/mood/MoodDashboard';

const MoodsPage: React.FC = () => {
  const router = useRouter();
  
  return (
    <>
      <Head>
        <title>Mood Tracker | Mindfulness Space</title>
        <meta name="description" content="Track your mood and see the effects of mindfulness practices on your emotional well-being." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-b from-blue-600 to-purple-700">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Mood Tracker</h1>
            <button 
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white transition-all duration-200"
            >
              Back to Home
            </button>
          </header>
          
          {/* Main content */}
          <main className="mb-12">
            <MoodDashboard />
          </main>
        </div>
      </div>
    </>
  );
};

export default MoodsPage; 