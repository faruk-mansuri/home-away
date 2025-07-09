// // // import { createClient } from '@supabase/supabase-js';

// // // const bucket = 'new-bucket';

// // // // Create a single supabase client for interacting with your database
// // // export const supabase = createClient(
// // //   'https://krwjhktdjeulxvtpfief.supabase.co',
// // //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyd2poa3RkamV1bHh2dHBmaWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTg0MjMsImV4cCI6MjA2NTY3NDQyM30.GqFVZj0ZQpiTG3OCFdj_3KWAywSI3ZMa7xdSgrLBAzo'
// // // );

// // // export const uploadImage = async (image: File) => {
// // //   const timestamp = Date.now();
// // //   // const newName = `/users/${timestamp}-${image.name}`;
// // //   const newName = `${timestamp}-${image.name}`;

// // //   const { data, error } = await supabase.storage
// // //     .from('new-bucket')
// // //     .upload(newName, image, {
// // //       cacheControl: '3600',
// // //     });
// // //   if (!data) throw new Error('Image upload failed');
// // //   return supabase.storage.from('new-bucket').getPublicUrl(newName).data
// // //     .publicUrl;
// // // };

// // // import { createClient } from '@supabase/supabase-js';

// // // // Create a single supabase client for interacting with your database

// // // const supabaseUrl =
// // //   process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
// // // const supabaseKey =
// // //   process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY;

// // // if (!supabaseUrl || !supabaseKey) {
// // //   throw new Error('Supabase environment variables are not set');
// // // }

// // // const supabase = createClient(supabaseUrl, supabaseKey);

// // // export async function uploadImage(file: File) {
// // //   try {
// // //     const fileName = file.name;
// // //     const newName = `users/${fileName}`;
// // //     const blob = file instanceof Blob ? file : new Blob([file]);
// // //     const { data, error } = await supabase.storage
// // //       .from('home-away')
// // //       .upload(newName, blob, {
// // //         cacheControl: '3600',
// // //         upsert: true,
// // //       });
// // //     if (error) {
// // //       console.error('Error uploading image:', error);
// // //       throw new Error('Image upload failed');
// // //     }
// // //     console.log('Image uploaded successfully:', data);
// // //     const { data: publicUrlData } = supabase.storage
// // //       .from('home-away')
// // //       .getPublicUrl(newName);
// // //     // if (publicUrlError) {
// // //     //   console.error('Error getting public URL:', publicUrlError);
// // //     //   throw new Error('Failed to get public URL');
// // //     // }
// // //     console.log(publicUrlData.publicUrl);
// // //     return publicUrlData.publicUrl;
// // //   } catch (err) {
// // //     console.error('Error in uploadImage:', err);
// // //     throw err;
// // //   }
// // // }

// // // import { createClient } from '@supabase/supabase-js';

// // // const bucket = 'new-bucket';

// // // Create a single supabase client for interacting with your database
// // // export const supabase = createClient(
// // //   process.env.SUPABASE_URL!,
// // //   process.env.SUPABASE_KEY!
// // // );
// // // const supabase = createClient(
// // //   'https://pwszinxarddbdstivlol.supabase.co',
// // //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3c3ppbnhhcmRkYmRzdGl2bG9sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNDA1NjcsImV4cCI6MjA2NzYxNjU2N30.3SekIimZI26WirGNzoYN_lvNTmt46U5gwFXaMCZfRrs'
// // // );
// // // const supabase = createClient(
// // //   'https://krwjhktdjeulxvtpfief.supabase.co',
// // //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyd2poa3RkamV1bHh2dHBmaWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTg0MjMsImV4cCI6MjA2NTY3NDQyM30.GqFVZj0ZQpiTG3OCFdj_3KWAywSI3ZMa7xdSgrLBAzo'
// // // );

// // // export const uploadImage = async (image: File) => {
// // //   const timestamp = Date.now();
// // //   // const newName = `/users/${timestamp}-${image.name}`;
// // //   const newName = `${timestamp}-${image.name}`;

// // //   const { data, error } = await supabase.storage
// // //     .from('new-bucket')
// // //     .upload(newName, image, {
// // //       cacheControl: '3600',
// // //     });
// // //   if (!data) throw new Error('Image upload failed');
// // //   return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
// // // };
// // import { createClient } from '@supabase/supabase-js';
// // // Create Supabase client
// // const supabase = createClient(
// //   'https://krwjhktdjeulxvtpfief.supabase.co',
// //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyd2poa3RkamV1bHh2dHBmaWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTg0MjMsImV4cCI6MjA2NTY3NDQyM30.GqFVZj0ZQpiTG3OCFdj_3KWAywSI3ZMa7xdSgrLBAzo'
// // );
// // // Upload file using standard upload
// // export async function uploadImage(file: File) {
// //   console.log('Uploading file:', file);
// //   const { data, error } = await supabase.storage
// //     .from('new-bucket')
// //     .upload('file_path_v3', file);
// //   console.log('Done file:', file);
// //   return supabase.storage.from('new-bucket').getPublicUrl('file_path_v3').data
// //     .publicUrl;

// //   if (error) {
// //     // Handle error
// //   } else {
// //     //   return supabase.storage.from(bucket).getPublicUrl(newName).data.publicUrl;
// //     // Handle success
// //   }
// // }

// 'use server';

// import { createClient } from '@supabase/supabase-js';
// // Create Supabase client
// const supabase = createClient(
//   'https://krwjhktdjeulxvtpfief.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyd2poa3RkamV1bHh2dHBmaWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTg0MjMsImV4cCI6MjA2NTY3NDQyM30.GqFVZj0ZQpiTG3OCFdj_3KWAywSI3ZMa7xdSgrLBAzo'
// );
// // Upload file using standard upload
// async function uploadFile(file: File) {
//   console.log('Uploading file:', file);
//   const { data, error } = await supabase.storage
//     .from('new-bucket')
//     .upload(new Date().getTime() + 'file_path_v2', file);
//   console.log('Done file:', file);

//   if (error) {
//     // Handle error
//   } else {
//     // Handle success
//   }
// }

// export const uploadImage = async (image: File) => {
//   // const response = await fetch('/api/upload', {
//   //   method: 'POST',
//   //   body: formData,
//   // });

//   // if (!response.ok) {
//   //   throw new Error('Failed to upload image');
//   // }
//   try {
//     await uploadFile(image);
//     console.log('...DONE UPLOADING');
//     return { message: 'Image uploaded successfully!' };
//   } catch (error) {
//     console.log('Error uploading image:', error);
//     return { message: 'Failed to upload image' };
//   }
// };

'use server';

import { createClient } from '@supabase/supabase-js';
// Create Supabase client
const supabase = createClient(
  'https://krwjhktdjeulxvtpfief.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtyd2poa3RkamV1bHh2dHBmaWVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTg0MjMsImV4cCI6MjA2NTY3NDQyM30.GqFVZj0ZQpiTG3OCFdj_3KWAywSI3ZMa7xdSgrLBAzo'
);
// Upload file using standard upload
async function uploadFile(file: File) {
  console.log('Uploading file:', file);
  const { data, error } = await supabase.storage
    .from('new-bucket')
    .upload(new Date().getTime() + 'file_path_v2', file);
  console.log('Done file:', file);

  if (error) {
    // Handle error
  } else {
    // Handle success
  }
}

export const uploadImage = async (image: File) => {
  // const response = await fetch('/api/upload', {
  //   method: 'POST',
  //   body: formData,
  // });

  // if (!response.ok) {
  //   throw new Error('Failed to upload image');
  // }
  try {
    console.log('Starting upload for image:', image);

    await uploadFile(image);
    console.log('...DONE UPLOADING');
    return { message: 'Image uploaded successfully!' };
  } catch (error) {
    console.log('Error uploading image:', error);
    return { message: 'Failed to upload image' };
  }
};
