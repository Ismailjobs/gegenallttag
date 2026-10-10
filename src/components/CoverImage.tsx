import Image, { type StaticImageData } from "next/image";

export default function CoverImage({
  src,
  alt,
  priority = false,
  sizes,
  className,
}: {
  src: string | StaticImageData;
  alt: string;
  priority?: boolean;
  sizes: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={72}
      className={className}
    />
  );
}
