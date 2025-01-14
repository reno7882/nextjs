// app/blog/page.tsx
import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardBody, Image } from '@nextui-org/react';

interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
  cover: {
    url: string;
    alternativeText: string;
  };
  publishedAt: string;
  category: {
    name: string;
  };
}

export default async function BlogPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Realizar la llamada a la API sin caché
  const res = await fetch(`${apiUrl}/api/articles?fields[0]=title&fields[1]=description&fields[2]=slug&fields[3]=publishedAt&populate[category][fields][0]=name&populate[cover][fields][0]=name&populate[cover][fields][1]=alternativeText&populate[cover][fields][2]=url`, {
    cache: 'no-store', // No almacenar nada en caché
    next: {
      revalidate: 0, // Revalidar los datos cada vez que se acceda a la página
    },
  });

  const data = await res.json();
  const articles = Array.isArray(data.data) ? data.data : [];

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', options);
  };

  return (
    <div>
      <h1>Blog</h1>
      <div>
        {articles.length === 0 ? (
          <p>No hay artículos disponibles.</p>
        ) : (
          articles.map((article: Article) => {
            const coverUrl = article.cover?.url || '/default-image.jpg'; // Usar imagen por defecto si no tiene imagen

            return (
              <div key={article.id} style={{ marginBottom: '20px' }}>
                <Link href={`/blog/${article.slug}`}>
                  <Card className="py-4">
                    <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                      <h4 className="font-bold text-large">{article.title}</h4>
                      <small className="text-default-500">{formatDate(article.publishedAt)}</small>
                      <p className="text-tiny uppercase font-bold">{article.category.name}</p>
                    </CardHeader>
                    <CardBody className="overflow-visible py-2">
                      <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                        <Image
                          alt={article.cover?.alternativeText || 'Cover Image'}
                          className="object-cover rounded-xl"
                          src={coverUrl}
                          style={{ objectFit: 'cover', width: '100%', height: '300px' }}
                        />
                      </div>
                      {article.description}
                    </CardBody>
                  </Card>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
