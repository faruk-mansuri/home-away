'use client';
import { useState } from 'react';
import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import { Card } from '@/components/ui/card';
import RatingInput from '@/components/form/RatingInput';
import TextAreaInput from '@/components/form/TextAreaInput';
import { Button } from '@/components/ui/button';
import { createReviewAction } from '@/utils/actions';

const SubmitReview = ({ propertyId }: { propertyId: string }) => {
  const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);

  return (
    <div className='mt-8'>
      <Button
        className='cursor-pointer'
        onClick={() => setIsReviewFormVisible((prev) => !prev)}
      >
        Leave a Review
      </Button>

      {isReviewFormVisible && (
        <Card className='mt-8 p-8'>
          <FormContainer action={createReviewAction}>
            <input hidden name='propertyId' value={propertyId} />

            <RatingInput name='rating' labelText='Rating' />

            <TextAreaInput
              name='comment'
              labelText='Your Review'
              defaultValue='Amazing place !!! I had a great time staying here.'
            />

            <SubmitButton className='mt-4' text='submit' />
          </FormContainer>
        </Card>
      )}
    </div>
  );
};

export default SubmitReview;
