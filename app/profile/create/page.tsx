import Buttons from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import { createProfileAction } from '@/utils/action';

const CreateProfilePage = () => {
  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>new user</h1>
      <div className='border p-8 rounded-md '>
        <FormContainer action={createProfileAction}>
          <div className='grid gap-4 md:grid-cols-2 mt-4'>
            <FormInput name='firstName' type='text' label='first name' />
            <FormInput name='lastName' type='text' label='last name' />
            <FormInput name='userName' type='text' label='Username' />
          </div>
          <Buttons text='Create Profile' className='mt-8' />
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateProfilePage;
