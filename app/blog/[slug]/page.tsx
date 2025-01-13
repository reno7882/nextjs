import React from 'react';
import MarkdownIt from 'markdown-it';

interface Article {
    id: number;
    title: string;
    description: string;
    content: string; // Asegúrate de que el artículo tenga un campo 'content' que contenga el Markdown
}

// Inicializamos MarkdownIt con la opción html activada
const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
});

const ArticlePage = async ({ params }: { params: { slug: string } }) => {
    const { slug } = await params;

    // Hacer fetch para obtener los detalles del artículo según el slug
    const res = await fetch(
        `http://localhost:1337/api/articles?filters[slug][$eq]=${slug}`
    );
    const data = await res.json();
    const article = data.data?.[0]; // Asumimos que solo hay un artículo con ese slug

    if (!article) {
        return <p>Artículo no encontrado.</p>;
    }

    // Paso 1: Dividir el contenido en bloques de código y texto normal
    const contentParts: string[] = article.content.split(/(```[\s\S]*?```)/); // Divide por bloques de código

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

    // Verificación: Ver el contenido renderizado
    // console.log(renderedContent);  Esto debería mostrar el HTML generado

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
