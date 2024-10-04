import { z, ZodError } from 'zod';
import { writable } from 'svelte/store';

// Custom validation helper object
const v = {
  string: (fieldName: string, minLength: number, maxLength: number) => z.string().min(minLength, `The ${fieldName} needs to have at least ${minLength} characters`).max(maxLength, `The ${fieldName} can have at most ${maxLength} characters`)
}

export const CreatePlaceFlags = ['butcher', 'fish', 'honey', 'dairy', 'restaurant'] as const;
export type PlaceFlag = typeof CreatePlaceFlags[number];

export const CreatePlaceFormCacheSchema = z.object({
  general: z.object({
    title: z.string().default(''),
    description: z.string().default(''),
    flags: z.array(z.enum(CreatePlaceFlags)).default([])
  }),
  location: z.object({
    streetAddress: z.string().default(''),
    streetNumber: z.string().default(''),
    postalCode: z.string().default(''),
    city: z.string().default(''),
    country: z.string().default(''),
    lat: z.null(), // we do not want to cache lat, user needs to re-confirm location
    lng: z.null()  // we do not want to cache lng, user needs to re-confirm location
  })
});

export const CreatePlaceFormSchema = z.object({
  general: z.object({
    title: z.string().min(4, 'The title needs to have at least 4 characters').max(80, 'The title can have at most 80 characters'),
    description: z.string().min(10, 'The description needs to have at least 10 characters').max(240, 'The description can have at most 240 characters'),
    flags: z.array(z.enum(CreatePlaceFlags))
  }),
  location: z.object({
    streetAddress: v.string('street address', 3, 64),
    streetNumber: v.string('street number', 1, 16),
    postalCode: v.string('postal code', 2, 8),
    city: v.string('city', 2, 32),
    country: v.string('country', 2, 32),
    lat: z.union([z.null(), z.coerce.number()]),
    lng: z.union([z.null(), z.coerce.number()])
  })
});

export type CreatePlaceForm = z.infer<typeof CreatePlaceFormSchema>;

const CREATE_PLACE_FORM_CACHE_KEY = 'create-place-form-cache-key';

function getCachedForm(): CreatePlaceForm {
  if (typeof localStorage === 'undefined') {
    return emptyForm;
  }

  const cached = localStorage.getItem(CREATE_PLACE_FORM_CACHE_KEY);

  if (!cached) {
    return emptyForm;
  }

  let parsed: CreatePlaceForm | null = null;

  try {
    parsed = CreatePlaceFormCacheSchema.parse(JSON.parse(cached));
  } catch (e) {
    console.warn('[carnivore-map/cache] Could not parse cached form.');
    return emptyForm;
  }

  return parsed;
}

const emptyForm: CreatePlaceForm = {
  general: {
    title: '',
    description: '',
    flags: [],
  },
  location: {
    streetAddress: '',
    postalCode: '',
    streetNumber: '',
    city: '',
    country: '',
    lat: null,
    lng: null
  }
}

export const form = writable<CreatePlaceForm>(getCachedForm());

const FORM_CACHING_TIMEOUT = 800;
let cachingDebouncer: number | null = null;

form.subscribe(currentForm => {
  if (cachingDebouncer) {
    clearTimeout(cachingDebouncer);
  }

  // cache to local storage every 10 seconds
  cachingDebouncer = setTimeout(() => {
    if (typeof localStorage === 'undefined') {
      return;
    }

    console.log('cached form...')
    localStorage.setItem(CREATE_PLACE_FORM_CACHE_KEY, JSON.stringify(currentForm));
  }, FORM_CACHING_TIMEOUT);
});

export function clearFormCache(): void {
  if (typeof localStorage === 'undefined') {
    return;
  }

  localStorage.removeItem(CREATE_PLACE_FORM_CACHE_KEY);
}

export function toggleFlag(flag: typeof CreatePlaceFlags[number]) {
  form.update(form => ({
    ...form,
    general: {
      ...form.general,
      flags: form.general.flags.find(_flag => _flag === flag) ? form.general.flags.filter(_flag => _flag !== flag) : [...form.general.flags, flag]
    }
  }));
}

export { ZodError };
