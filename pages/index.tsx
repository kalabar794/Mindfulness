import React from 'react';
import Head from 'next/head';
import HomeScreen from '../components/HomeScreen';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Interactive Mindfulness Space</title>
        <meta name="description" content="A calm, interactive space for mindfulness practices and meditation" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#8b5cf6" />
      </Head>
      <HomeScreen />
    </>
  );
};

export default Home;
