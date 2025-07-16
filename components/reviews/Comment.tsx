'use client';
import { useState } from 'react';
import { Button } from '../ui/button';

const Comment = ({ comment }: { comment: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const longComment = comment.length > 130;

  const displayComment =
    longComment && isExpanded ? comment : comment.slice(0, 130) + '...';

  return (
    <div>
      <p className='text-sm'>{displayComment}</p>
      {longComment && (
        <Button
          variant='link'
          className='pl-0 text-muted-foreground cursor-pointer'
          onClick={toggleExpand}
        >
          {isExpanded ? 'Show less' : 'Show more'}
        </Button>
      )}
    </div>
  );
};

export default Comment;
