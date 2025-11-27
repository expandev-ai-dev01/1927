import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

const HomePage = lazy(() => import('@/pages/Home').then((m) => ({ default: m.HomePage })));
const SearchPage = lazy(() => import('@/pages/Search').then((m) => ({ default: m.SearchPage })));
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound').then((m) => ({ default: m.NotFoundPage }))
);

const LoadingFallback = () => (
  <div className="flex h-screen w-screen items-center justify-center">
    <div className="border-primary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent" />
  </div>
);

const routes = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MainLayout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'busca',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <SearchPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export { routes };
