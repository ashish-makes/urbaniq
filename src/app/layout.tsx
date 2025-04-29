export const metadata = {
  title: {
    template: '%s | UrbanIQ',
    default: 'UrbanIQ - Smart Pet Tech',
  },
  description: 'Innovative smart devices for modern pets',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 