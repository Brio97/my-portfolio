import React, { useEffect, useState } from 'react';

export const AdUnit = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [adError, setAdError] = useState(false);
  const isProduction = process.env.NODE_ENV === 'production' && window.location.hostname !== 'localhost';
  const AD_TIMEOUT = 3000;

  const trackAdPerformance = (success, loadTime) => {
    if (window.gtag) {
      window.gtag('event', 'ad_performance', {
        success,
        load_time: loadTime,
        timestamp: new Date().toISOString()
      });
    }
  };

  useEffect(() => {
    if (!isProduction) return;

    const startTime = performance.now();
    const timeoutId = setTimeout(() => {
      setAdError(true);
      setIsLoading(false);
      trackAdPerformance(false, AD_TIMEOUT);
    }, AD_TIMEOUT);

    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      const loadTime = performance.now() - startTime;
      trackAdPerformance(true, loadTime);
      setIsLoading(false);
    } catch (error) {
      console.log('AdSense error:', error);
      setAdError(true);
      setIsLoading(false);
      trackAdPerformance(false, performance.now() - startTime);
    }

    return () => clearTimeout(timeoutId);
  }, [isProduction]);

  if (!isProduction) return null;
  if (adError) return <div className="h-[250px] bg-gray-100 rounded-lg" />;
  
  return (
    <div className="my-6 relative min-h-[250px]">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
      )}
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="pub-1649606057243393"
        data-ad-slot="4137053655"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};