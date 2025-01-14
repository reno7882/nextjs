import React from 'react';
import MarkdownIt from 'markdown-it';

// Obtener la URL base de la API desde las variables de entorno
const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

// Inicializamos MarkdownIt con la opción html activada
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

const ArticlePage = async ({ params }) => {
    // Esperamos a que 'params' esté disponible
    const { slug } = await params;  // Aquí hemos agregado 'await' para esperar la promesa

    // Hacer fetch para obtener los detalles del artículo según el slug
    const res = await fetch(
        `${apiUrl}/api/articles?filters[slug][$eq]=${slug}&populate=cover`
    );
    const data = await res.json();

    if (!data || !data.data || data.data.length === 0) {
        return <p>Artículo no encontrado.</p>;
    }

    const article = data.data[0]; // Asumimos que solo hay un artículo con ese slug

    // Paso 1: Dividir el contenido en bloques de código y texto normal
    const contentParts = article.content.split(/(```[\s\S]*?```)/); // Divide por bloques de código

    // Paso 2: Procesar las partes de contenido
    const contentWithLineBreaks = contentParts
        .map((part) => {
            if (part.startsWith('```')) {
                // Si es un bloque de código, lo dejamos tal cual pero envolviendo con <pre><code></code></pre>
                return `<pre><code>${part
                    .replace(/```/g, '') // Eliminar las ``` de los bloques de código
                    .replace(/\n/g, '\n') // Asegurarse de que los saltos de línea se mantengan
                    .replace(/ /g, '&nbsp;') // Reemplazar los espacios por &nbsp; para mantener la indentación
                    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;') // Reemplazar tabs por 4 espacios
                    }</code></pre>`;
            }
            // Si no es código, reemplazar los saltos de línea por <br />
            return part.replace(/\n/g, '<br />');
        })
        .join(''); // Volver a unir las partes

    // Paso 3: Convertir el contenido a HTML usando markdown-it
    const renderedContent = md.render(contentWithLineBreaks);

    return (
        <div>
            <h1>{article.title}</h1>
            <p>{article.description}</p>
            <div
                dangerouslySetInnerHTML={{ __html: renderedContent }}
            />
        </div>
    );
};

export default ArticlePage;
