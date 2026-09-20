import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App.js';
import './styles/tokens.css';
import './styles/typography.css';
import './styles/global.css';

function syncSiteMetadata(): void {
  const pagePath = window.location.pathname.replace(/\/+$/, '') || '/';
  const absoluteUrl = (path: string): string => new URL(path, window.location.origin).href;
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  const openGraphUrl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  const openGraphImage = document.querySelector<HTMLMetaElement>('meta[property="og:image"]');
  const twitterImage = document.querySelector<HTMLMetaElement>('meta[name="twitter:image"]');

  canonical?.setAttribute('href', absoluteUrl(pagePath));
  openGraphUrl?.setAttribute('content', absoluteUrl(pagePath));
  openGraphImage?.setAttribute('content', absoluteUrl('/images/cases/velora.webp'));
  twitterImage?.setAttribute('content', absoluteUrl('/images/cases/velora.webp'));
}

syncSiteMetadata();

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');
createRoot(root).render(<React.StrictMode><App /></React.StrictMode>);
