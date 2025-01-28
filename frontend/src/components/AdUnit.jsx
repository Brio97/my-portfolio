import React, { useEffect, useRef } from 'react';

export const AdUnit = () => {
  const adRef = useRef(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    const loadAd = () => {
      if (!adInitialized.current && 
          adRef.current && 
          window.location.hostname !== 'localhost' && 
          window.adsbygoogle) {
        adInitialized.current = true;
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };

    const script = document.createElement('script');
    script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1649606057243393';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.onload = loadAd;
    document.head.appendChild(script);

    return () => {
      adInitialized.current = false;
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full my-6">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1649606057243393"
        data-ad-slot="7323454267"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};