import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import PosterFallback from './PosterFallback';
import './imageWithFallback.scss';

const ImageWithFallback = ({
  src,
  alt,
  title,
  year,
  type,
  className,
  imageClassName,
  aspectRatio,
  loading,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const shouldRenderImage = useMemo(
    () => typeof src === 'string' && src.trim().length > 0 && !hasError,
    [src, hasError]
  );

  return (
    <div
      className={`image-with-fallback ${className || ''} ${isLoaded ? 'is-loaded' : ''}`}
      style={{ '--image-aspect-ratio': aspectRatio }}
    >
      <div className="image-with-fallback__skeleton" aria-hidden />
      {shouldRenderImage && (
        <img
          src={src}
          alt={alt}
          loading={loading}
          className={`image-with-fallback__image ${imageClassName || ''}`}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
      {!shouldRenderImage && (
        <PosterFallback
          title={title}
          year={year}
          type={type}
          className="image-with-fallback__poster"
        />
      )}
    </div>
  );
};

ImageWithFallback.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  imageClassName: PropTypes.string,
  aspectRatio: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
};

ImageWithFallback.defaultProps = {
  src: '',
  alt: 'Poster',
  title: '',
  year: '',
  type: '',
  className: '',
  imageClassName: '',
  aspectRatio: '2 / 3',
  loading: 'lazy',
};

export default ImageWithFallback;
