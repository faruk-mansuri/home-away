import { createClient } from '@supabase/supabase-js';

const bucket = 'home-away';

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
);

export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  // const imageName = `/users/${timestamp}-${image.name}`;
  const imageName = `${timestamp}-${image.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(imageName, image, {
      cacheControl: '3600',
    });
  if (!data) throw new Error('Image upload failed');
  return supabase.storage.from(bucket).getPublicUrl(imageName).data.publicUrl;
};
