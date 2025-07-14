'use client';
import { useState } from 'react';
import Title from './Title';
import { Button } from '../ui/button';

const Description = ({ description }: { description: string }) => {
  const [isFullDescription, setIsFullDescription] = useState(false);

  const word = description.split(' ');
  const isLongDescription = word.length > 100;

  const toggleDescription = () => {
    setIsFullDescription(!isFullDescription);
  };

  const displayedDescription =
    isLongDescription && isFullDescription
      ? description
      : word.slice(0, 100).join(' ') + '...';

  return (
    <article className='mt-4'>
      <Title text='Description' />
      <p className='text-muted-foreground font-light leading-loose '>
        {displayedDescription}
      </p>

      {isLongDescription && (
        <Button
          variant='link'
          className='pl-0 cursor-pointer'
          onClick={toggleDescription}
        >
          {isFullDescription ? 'Show less' : 'Show more'}
        </Button>
      )}
    </article>
  );
};

export default Description;
