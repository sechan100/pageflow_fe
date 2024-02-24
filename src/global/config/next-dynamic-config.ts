import dynamic from 'next/dynamic';

export const RootAuthFromLocalStorage = dynamic(
  () => import('@/global/hook/useRootAuth').then(mod => mod.useRootAuth), 
  { ssr: false }
);
