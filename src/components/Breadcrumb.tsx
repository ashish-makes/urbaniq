import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav 
      className={`flex items-center text-sm text-gray-500 ${className}`}
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center space-x-1 md:space-x-2">
        {/* Home item */}
        <li className="flex items-center">
          <Link 
            href="/" 
            className="flex items-center hover:text-primary transition-colors"
            aria-label="Home"
          >
            <Home size={16} className="mr-1" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </li>

        {/* Separator */}
        <li>
          <ChevronRight size={14} className="text-gray-400" />
        </li>

        {/* Dynamic items */}
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRight size={14} className="mr-1 md:mr-2 text-gray-400" />
            )}
            
            {item.href && index !== items.length - 1 ? (
              <Link 
                href={item.href} 
                className="hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="font-medium text-gray-900" aria-current={index === items.length - 1 ? 'page' : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 