// 'use client';
// import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import { icon } from 'leaflet';
// const iconUrl =
//   'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
// const markerIcon = icon({
//   iconUrl: iconUrl,
//   iconSize: [20, 30],
// });

// import { findCountryByCode } from '@/utils/countries';
// import CountryFlagAndName from '../card/CountryFlagAndName';
// import Title from './Title';

// const PropertyMap = ({ countryCode }: { countryCode: string }) => {
//   const defaultLocation = [51.505, -0.09] as [number, number];
//   const location = findCountryByCode(countryCode)?.location as [number, number];

//   return (
//     <div className='mt-4'>
//       <div className='mb-4'>
//         <Title text='Where you will staying' />
//         <CountryFlagAndName countryCode={countryCode} />
//       </div>

//       <MapContainer
//         center={location || defaultLocation}
//         zoomControl={false}
//         scrollWheelZoom={false}
//         className='h-[50vh] rounded-lg relative z-0'
//         zoom={7}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
//         />
//         <ZoomControl position='bottomright' />
//         <Marker position={location || defaultLocation} icon={markerIcon} />
//       </MapContainer>
//     </div>
//   );
// };

// export default PropertyMap;

'use client';

import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { findCountryByCode } from '@/utils/countries';
import CountryFlagAndName from '../card/CountryFlagAndName';
import Title from './Title';

const PropertyMap = ({ countryCode }: { countryCode: string }) => {
  const [isClient, setIsClient] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [mapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);

    // Dynamic import of react-leaflet components
    const loadMap = async () => {
      const { MapContainer, TileLayer, Marker, ZoomControl } = await import(
        'react-leaflet'
      );
      const { icon } = await import('leaflet');

      // Import CSS

      const iconUrl =
        'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png';
      const markerIcon = icon({
        iconUrl: iconUrl,
        iconSize: [20, 30],
      });

      setMapComponents({
        MapContainer,
        TileLayer,
        Marker,
        ZoomControl,
        markerIcon,
      });
    };

    loadMap();
  }, []);

  if (!isClient || !mapComponents) {
    return <Skeleton className='h-[400px] w-full' />;
  }

  const defaultLocation = [51.505, -0.09] as [number, number];
  const location = findCountryByCode(countryCode)?.location as [number, number];

  const { MapContainer, TileLayer, Marker, ZoomControl, markerIcon } =
    mapComponents;

  return (
    <div className='mt-4'>
      <div className='mb-4'>
        <Title text='Where you will staying' />
        <CountryFlagAndName countryCode={countryCode} />
      </div>

      <MapContainer
        center={location || defaultLocation}
        zoomControl={false}
        scrollWheelZoom={false}
        className='h-[50vh] rounded-lg relative z-0'
        zoom={7}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <ZoomControl position='bottomright' />
        <Marker position={location || defaultLocation} icon={markerIcon} />
      </MapContainer>
    </div>
  );
};

export default PropertyMap;
