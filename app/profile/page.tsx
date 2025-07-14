import { SubmitButton } from '@/components/form/Buttons';
import FormContainer from '@/components/form/FormContainer';
import FormInput from '@/components/form/FormInput';
import ImageInputContainer from '@/components/form/ImageInputContainer';
import {
  updateProfileAction,
  fetchProfile,
  updateProfileImageAction,
} from '@/utils/actions';

const UpdateProfile = async () => {
  const profile = await fetchProfile();

  return (
    <section>
      <h1 className='text-2xl font-semibold mb-8 capitalize'>User Profile</h1>
      <div className='border p-8 rounded-md '>
        <ImageInputContainer
          action={updateProfileImageAction}
          image={profile.profileImage}
          name={profile.username}
          text='Update Profile Image'
        />
        <FormContainer action={updateProfileAction}>
          <div className='grid gap-4 md:grid-cols-2 mt-4'>
            <FormInput
              name='firstName'
              type='text'
              label='first name'
              defaultValue={profile.firstName}
            />
            <FormInput
              name='lastName'
              type='text'
              label='last name'
              defaultValue={profile.lastName}
            />
            <FormInput
              name='username'
              type='text'
              label='Username'
              defaultValue={profile.username}
            />
          </div>
          <SubmitButton text={'Update Profile'} className='mt-8' />
        </FormContainer>
      </div>
    </section>
  );
};

export default UpdateProfile;
