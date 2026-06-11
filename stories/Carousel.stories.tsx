/**
 * Carousel component stories.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { Carousel } from '../src/components/layout/Carousel';
import { Text } from '../src/components/basic/Text';

const meta: Meta<typeof Carousel> = {
  title: 'Layout/Carousel',
  component: Carousel,
};
export default meta;

type CarouselStory = StoryObj<typeof Carousel>;

export const AutoPlayCarousel: CarouselStory = {
  name: 'Auto-play Carousel',
  render: () => (
    <Carousel
      id="carousel-1"
      type="Carousel"
      properties={{
        autoplay: true,
        autoplaySpeed: 3000,
        effect: 'scrollx',
      }}
    >
      <div style={{ background: '#364d79', padding: 40, textAlign: 'center', color: '#fff' }}>
        <Text id="sl-1" type="Text" properties={{ text: 'Slide 1', variant: 'h2', color: '#fff' }} />
      </div>
      <div style={{ background: '#00b96b', padding: 40, textAlign: 'center', color: '#fff' }}>
        <Text id="sl-2" type="Text" properties={{ text: 'Slide 2', variant: 'h2', color: '#fff' }} />
      </div>
      <div style={{ background: '#ff7a45', padding: 40, textAlign: 'center', color: '#fff' }}>
        <Text id="sl-3" type="Text" properties={{ text: 'Slide 3', variant: 'h2', color: '#fff' }} />
      </div>
    </Carousel>
  ),
};
