import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// Agregar el tipo `Article` aquí
export interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}