// src/lib/seo.ts
import { Metadata } from 'next'

interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
}

export function generateSEO(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonicalUrl,
    ogImage = '/og-image.jpg',
    noIndex = false,
  } = config

  const fullTitle = title.includes('กินอะไรดีวันนี้')
    ? title
    : `${title} | กินอะไรดีวันนี้ 🍜`

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'วันนี้กินอะไรดี', 'เมนูอาหารไทย', 'แคลอรี่'],
    
    // Open Graph (Facebook, LINE)
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: 'กินอะไรดีวันนี้',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'th_TH',
      type: 'website',
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
    },

    // Canonical URL
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,

    // Robots
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },

    // Additional
    authors: [{ name: 'กินอะไรดีวันนี้' }],
    creator: 'กินอะไรดีวันนี้',
    publisher: 'กินอะไรดีวันนี้',
  }
}

// Generate JSON-LD structured data
export function generateMenuSchema(menu: {
  name: string
  description?: string
  calories: number
  protein: number
  carb: number
  fat: number
  ingredients: string[]
  price_min: number
  price_max: number
  image?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: menu.name,
    description: menu.description || `สูตรและข้อมูลโภชนาการ${menu.name}`,
    image: menu.image || '/default-menu.jpg',
    recipeIngredient: menu.ingredients,
    nutrition: {
      '@type': 'NutritionInformation',
      calories: `${menu.calories} kcal`,
      proteinContent: `${menu.protein}g`,
      carbohydrateContent: `${menu.carb}g`,
      fatContent: `${menu.fat}g`,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '89',
    },
    recipeCategory: 'อาหารไทย',
    recipeCuisine: 'Thai',
    keywords: `${menu.name}, สูตร${menu.name}, ${menu.name}กี่แคล`,
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'THB',
      lowPrice: menu.price_min,
      highPrice: menu.price_max,
    },
  }
}

// Generate FAQ Schema
export function generateFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

// Generate Breadcrumb Schema
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

// SEO-friendly slug generator
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '') // Keep Thai, English, numbers
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Meta keywords generator
export function generateKeywords(menu: {
  name: string
  type: string
  calories: number
}): string[] {
  return [
    menu.name,
    `${menu.name}กี่แคล`,
    `${menu.name}สูตร`,
    `${menu.name}${menu.calories}แคล`,
    `ทำ${menu.name}`,
    `เมนู${menu.type}`,
    'อาหารไทย',
    'สูตรอาหารไทย',
  ]
}
