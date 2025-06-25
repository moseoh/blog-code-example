'use client';

import Image from "next/image";
import { useState, useCallback, useEffect } from "react";

const images = [
  "https://fastly.picsum.photos/id/28/4928/3264.jpg?hmac=GnYF-RnBUg44PFfU5pcw_Qs0ReOyStdnZ8MtQWJqTfA",
  "https://fastly.picsum.photos/id/27/3264/1836.jpg?hmac=p3BVIgKKQpHhfGRRCbsi2MCAzw8mWBCayBsKxxtWO8g",
  "https://fastly.picsum.photos/id/26/4209/2769.jpg?hmac=vcInmowFvPCyKGtV7Vfh7zWcA_Z0kStrPDW3ppP0iGI",
  "https://fastly.picsum.photos/id/25/5000/3333.jpg?hmac=yCz9LeSs-i72Ru0YvvpsoECnCTxZjzGde805gWrAHkM",
  "https://fastly.picsum.photos/id/24/4855/1803.jpg?hmac=ICVhP1pUXDLXaTkgwDJinSUS59UWalMxf4SOIWb9Ui4",
  "https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU",
];

interface ImageLoadInfo {
  src: string;
  endTime?: number;
  loadTime?: number;
  loaded: boolean;
}

export default function ImageRenderingPage() {
  const [imageLoadInfos, setImageLoadInfos] = useState<ImageLoadInfo[]>(() =>
    images.map(src => ({
      src,
      loaded: false,
    }))
  );
  const [measurementStartTime, setMeasurementStartTime] = useState<number>(0);
  const [totalLoadTime, setTotalLoadTime] = useState<number>(0);
  const [allLoaded, setAllLoaded] = useState<boolean>(false);
  const [loadCount, setLoadCount] = useState<number>(0);

  const handleImageLoad = useCallback((index: number) => {
    const endTime = Date.now();
    setImageLoadInfos(prev => {
      const newInfos = [...prev];
      if (!newInfos[index].loaded) {
          const loadTime = endTime - measurementStartTime;
          newInfos[index] = { ...newInfos[index], endTime, loadTime, loaded: true };
      }

      const allImagesLoaded = newInfos.every(info => info.loaded);
      if (allImagesLoaded && !allLoaded && measurementStartTime > 0) {
        setTotalLoadTime(endTime - measurementStartTime);
        setAllLoaded(true);
      }

      return newInfos;
    });
  }, [measurementStartTime, allLoaded]);

  const reloadImages = useCallback(() => {
    setLoadCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    setMeasurementStartTime(Date.now());
    setTotalLoadTime(0);
    setAllLoaded(false);
    setImageLoadInfos(
      images.map(src => ({
        src,
        loaded: false,
      }))
    );
  }, [loadCount]);

  // 현재 로드 사이클의 완료된 이미지들만 계산
  const currentLoadImages = imageLoadInfos.filter(info => info.loaded && info.loadTime);
  const averageLoadTime = currentLoadImages.length > 0
    ? currentLoadImages.reduce((sum, info) => sum + (info.loadTime || 0), 0) / currentLoadImages.length
    : 0;

  return (
    <div>
      <h1>Image Rendering Test Page</h1>
      <p>
        This page measures actual image loading times to test cache effectiveness.
      </p>

      <div style={{ marginBottom: "20px", padding: "16px", backgroundColor: "#f5f5f5", borderRadius: "8px" }}>
        <h3>Loading Statistics (Load #{loadCount + 1})</h3>
        <p><strong>Total load time: {allLoaded ? `${totalLoadTime}ms` : 'Loading...'}</strong></p>
        <p><strong>Average per image: {averageLoadTime > 0 ? `${Math.round(averageLoadTime)}ms` : 'N/A'}</strong></p>
        <p><strong>Images loaded: {imageLoadInfos.filter(info => info.loaded).length} / {images.length}</strong></p>
        
        <button 
          onClick={reloadImages}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Reload Images (Test Cache)
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "16px",
          marginTop: "20px",
        }}
      >
        {images.map((src, index) => {
          const info = imageLoadInfos[index];
          return (
            <div
              key={`${src}-${loadCount}`}
              style={{
                position: "relative",
                width: "100%",
                height: "300px",
                border: `2px solid ${info.loaded ? '#00ff00' : '#ddd'}`,
                borderRadius: "8px",
                overflow: "hidden"
              }}
            >
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                backgroundColor: "rgba(0,0,0,0.7)",
                color: "white",
                padding: "4px 8px",
                fontSize: "12px",
                zIndex: 10
              }}>
                Image {index + 1}: {
                  info.loaded 
                    ? `${info.loadTime}ms`
                    : 'Loading...'
                }
              </div>
              <Image
                src={src}
                alt={`Test Image ${index + 1}`}
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                onLoad={() => handleImageLoad(index)}
                priority={index < 2} // 첫 2개 이미지는 priority 설정
              />
            </div>
          );
        })}
      </div>
    </div>
  );
} 