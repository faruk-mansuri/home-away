export type actionFunction = (
  prevState: any,
  formData: FormData
) => Promise<{ message: string; inputs?: { [k: string]: FormDataEntryValue } }>;
