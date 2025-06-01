import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all products
    const products = await prisma.product.findMany({
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    });

    // Get all categories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    });

    // Base URL - ensure it doesn't have a trailing slash
    const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://urbaniq.ca').replace(/\/$/, '');

    // Create the XML sitemap
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

    // Add static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/products', priority: '0.9', changefreq: 'daily' },
      { url: '/search', priority: '0.7', changefreq: 'weekly' },
    ];

    staticPages.forEach((page) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.url}</loc>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add product pages
    products.forEach((product) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/products/${product.slug}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += `    <lastmod>${new Date(product.updatedAt).toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
    });

    // Add category pages
    categories.forEach((category) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}/products/category/${category.slug}</loc>\n`;
      xml += '    <changefreq>weekly</changefreq>\n';
      xml += '    <priority>0.8</priority>\n';
      xml += `    <lastmod>${new Date(category.updatedAt).toISOString()}</lastmod>\n`;
      xml += '  </url>\n';
    });

    xml += '</urlset>';

    // Return the XML response
    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'text/xml',
      },
    });
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return NextResponse.json(
      { error: 'Failed to generate sitemap' },
      { status: 500 }
    );
  }
} 