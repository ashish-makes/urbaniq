import type { Metadata } from 'next';

// Dynamic metadata based on search query
export async function generateMetadata({
  params,
  searchParams
}: {
  params: { slug?: string };
  searchParams: { q?: string };
}): Promise<Metadata> {
  const query = searchParams?.q || '';
  
  return {
    title: query 
      ? `Search results for "${query}" | UrbanIQ Pet Tech` 
      : 'Search Products | UrbanIQ Pet Tech',
    description: query
      ? `Browse search results for "${query}" - Find the best pet tech products at UrbanIQ`
      : 'Search for smart pet technology, feeders, cameras, trackers and more at UrbanIQ',
    openGraph: {
      title: query 
        ? `Search results for "${query}" | UrbanIQ Pet Tech` 
        : 'Search Products | UrbanIQ Pet Tech',
      description: query
        ? `Browse search results for "${query}" - Find the best pet tech products at UrbanIQ`
        : 'Search for smart pet technology, feeders, cameras, trackers and more at UrbanIQ',
    }
  };
}

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
} 