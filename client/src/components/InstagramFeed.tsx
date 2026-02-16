import { useEffect } from 'react';

interface InstagramFeedProps {
  username: string;
}

export default function InstagramFeed({ username }: InstagramFeedProps) {
  useEffect(() => {
    // Cargar el script de Instagram embeds
    const script = document.createElement('script');
    script.src = 'https://www.instagram.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    // Procesar embeds cuando el script carga
    if (window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, []);

  return (
    <div className="instagram-feed-container">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={`https://www.instagram.com/${username}/?utm_source=ig_embed&utm_campaign=loading`}
        data-instgrm-version="14"
      >
        <a href={`https://www.instagram.com/${username}/?utm_source=ig_embed&utm_campaign=loading`} target="_blank" rel="noopener noreferrer">
          Ver este perfil en Instagram
        </a>
      </blockquote>
    </div>
  );
}

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}
