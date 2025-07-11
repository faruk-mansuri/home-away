// import { createClient } from '@supabase/supabase-js';

// // Create a single supabase client for interacting with your database

// const supabaseUrl =
//   process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
// const supabaseKey =
//   process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error('Supabase environment variables are not set');
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// export async function uploadImage(file: File) {
//   try {
//     const fileName = file.name;
//     const newName = `users/${fileName}`;
//     const blob = file instanceof Blob ? file : new Blob([file]);
//     const { data, error } = await supabase.storage
//       .from('home-away')
//       .upload(newName, blob, {
//         cacheControl: '3600',
//         upsert: true,
//       });
//     if (error) {
//       console.error('Error uploading image:', error);
//       throw new Error('Image upload failed');
//     }
//     console.log('Image uploaded successfully:', data);
//     const { data: publicUrlData } = supabase.storage
//       .from('home-away')
//       .getPublicUrl(newName);
//     // if (publicUrlError) {
//     //   console.error('Error getting public URL:', publicUrlError);
//     //   throw new Error('Failed to get public URL');
//     // }
//     console.log(publicUrlData.publicUrl);
//     return publicUrlData.publicUrl;
//   } catch (err) {
//     console.error('Error in uploadImage:', err);
//     throw err;
//   }
// }

import { createClient } from '@supabase/supabase-js';

const bucket = 'home-away-draft';

// Create a single supabase client for interacting with your database
export const supabase = createClient(
  'https://zofdonvdyqqczhjetbgz.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvZmRvbnZkeXFxY3poamV0Ymd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMjA5NzUsImV4cCI6MjA2NzU5Njk3NX0.YRiipTQSwfZ_93UpUwtyDJ9UwM1T0CCdYQPBynek4pg'
);

export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  // const newName = `/users/${timestamp}-${image.name}`;
  const newName = `${timestamp}-${image.name}`;

  const { data, error } = await supabase.storage
    .from('test')
    .upload(newName, image, {
      cacheControl: '3600',
    });
  if (!data) throw new Error('Image upload failed');
  return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
};
