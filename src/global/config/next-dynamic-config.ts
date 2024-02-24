import dynamic from 'next/dynamic';

export const RootAuthFromLocalStorage = dynamic(
  () => import('@/global/hook/useAuth').then(mod => mod.useAuth), 
  { ssr: false }
);
