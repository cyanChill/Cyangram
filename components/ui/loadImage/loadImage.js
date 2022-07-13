import { useState, useEffect } from "react";
import Image from "next/image";

import classes from "./loadImage.module.css";

const LoadImage = ({ src, width, height, alt, className, ...rest }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setImgSrc(src);

    return () => {
      setLoading(false);
    };
  }, [src]);

  return (
    <Image
      className={`${classes.imgBackdrop} ${
        loading && classes.animatedBkg
      } ${className}`}
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      {...rest}
      onLoadingComplete={() => setLoading(false)}
      onError={() => setImgSrc("/static/images/assets/error-image.png")}
    />
  );
};

export default LoadImage;
