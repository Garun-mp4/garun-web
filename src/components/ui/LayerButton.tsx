import React from 'react';

interface Props {
  href?: string;
  children: React.ReactNode;
  variant?: 'dark' | 'light' | 'outline';
  portrait?: boolean;
  external?: boolean;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  ariaLabel?: string;
}

export function LayerButton({ href, children, variant = 'outline', portrait = false, external = false, onClick, className = '', ariaLabel }: Props): React.ReactElement {
  const renderPortrait = () => portrait ? <img src="/images/portrait/portrait-button.webp" alt="" width="28" height="28" decoding="async" /> : null;
  const content = <span className="layer-button__stage">
    <span className="layer-button__sizer" aria-hidden="true">{renderPortrait()}<span>{children}</span></span>
    <span className="layer-button__layer layer-button__layer--base">{renderPortrait()}<span>{children}</span></span>
    <span className="layer-button__layer layer-button__layer--hover" aria-hidden="true">{renderPortrait()}<span>{children}</span></span>
  </span>;
  const classes = `layer-button layer-button--${variant} ${className}`.trim();
  if (href) {
    return <a className={classes} href={href} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined} onClick={onClick} aria-label={ariaLabel}>{content}</a>;
  }
  return <button className={classes} type="button" onClick={onClick} aria-label={ariaLabel}>{content}</button>;
}
