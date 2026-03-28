import dynamic from 'next/dynamic';

export const DynamicMap = dynamic(
  () => import('./StateMap'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-200 dark:border-gray-700">
        <div className="w-8 h-8 rounded-full border-4 border-podemos-green border-t-transparent animate-spin mb-4"></div>
        <span className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">Carregando mapa geopolítico...</span>
      </div>
    )
  }
);
