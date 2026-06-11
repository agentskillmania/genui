import React from 'react';
import { Anchor as AntAnchor } from 'antd';
import type { GenUIComponentProps } from '../types';

/**
 * Anchor component — in-page navigation with hash-link tracking.
 * Fires onAction('click', {href}) when an anchor link is clicked.
 */
export const Anchor: React.FC<GenUIComponentProps> = ({ properties, onAction }) => {
  const { items, offsetTop, affix, style } = properties ?? {};

  const anchorItems = (
    items as Array<{ key: string; href: string; title: string; children?: Array<{ key: string; href: string; title: string }> }> ?? []
  ).map((item) => ({
    key: item.key,
    href: item.href,
    title: item.title,
    children: item.children?.map((child) => ({
      key: child.key,
      href: child.href,
      title: child.title,
    })),
  }));

  const handleClick = (e: React.MouseEvent<HTMLElement>, link: { href: string }) => {
    e.preventDefault();
    onAction?.('click', { href: link.href });
  };

  return (
    <AntAnchor
      items={anchorItems}
      offsetTop={offsetTop as number}
      affix={affix as boolean}
      style={style as React.CSSProperties}
      onClick={handleClick}
    />
  );
};
Anchor.displayName = 'Anchor';
