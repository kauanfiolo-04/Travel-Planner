"use client";

import { useEffect, useRef, useState } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[600px] w-full">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
    </div>
  )
});

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

const GlobePage = () => {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(new Set());
  const [locations, setLocations] = useState<TransformedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [dimensions, setDimensions] = useState({ width: 400, height: 400 });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/trips");
        const data = await response.json();
        setLocations(data);
        const countries = new Set<string>(data.map((loc: TransformedLocation) => loc.country));
        setVisitedCountries(countries);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width } = entry.contentRect;
        const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
        const height = isMobile ? 400 : 600; 
        
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

useEffect(() => {
    setTimeout(() => {
      const globe = globeRef.current;

      if (globe) {
        globe.controls().autoRotate = true;
        globe.controls().autoRotateSpeed = 0.5;
        
        if (window.innerWidth < 768) {
          globe.controls().enableZoom = false; 
        }
      }
    }, 100);
  }, [isLoading]);

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-center text-4xl font-bold mb-12">Your Travel Journey</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">See where you've been</h2>

                <div ref={containerRef} className="w-full relative flex justify-center items-center min-h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-[600px] w-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                    </div>
                  ) : (
                    <Globe
                      ref={globeRef}
                      globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                      bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                      backgroundColor="rgba(0,0,0,0)"
                      pointColor={() => "#FF5733"}
                      pointLabel="name"
                      pointsData={locations}
                      pointRadius={0.5}
                      pointAltitude={0.1}
                      pointsMerge={true}
                      width={dimensions.width}
                      height={dimensions.height}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Countries Visited</CardTitle>
                </CardHeader>

                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-sm text-blue-800">
                          You've visited <span className="font-bold">{visitedCountries.size}</span> countries
                        </p>
                      </div>

                      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                        {Array.from(visitedCountries)
                          .sort().map((country, idx) => (
                            <div 
                              className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                              key={idx} 
                            >
                              <MapPin className="h-4 w-4 text-red-500" />
                              <span className="font-medium">{country}</span>
                            </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GlobePage;