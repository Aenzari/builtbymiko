export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
  scopeTags: string[];
  budget: string | null;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
  scopeTags?: string;
  budget?: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Plain, dependency-free validation — deliberately not pulling in a schema
 * library for four fields. Returns an errors object with only the keys that
 * failed, so callers can check `Object.keys(errors).length === 0`.
 */
export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) {
    errors.name = "Tell me your name.";
  } else if (values.name.trim().length < 2) {
    errors.name = "Name looks too short.";
  }

  if (!values.email.trim()) {
    errors.email = "An email is required so I can reply.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "That doesn't look like a valid email.";
  }

  if (!values.message.trim()) {
    errors.message = "Add a few words about what you have in mind.";
  } else if (values.message.trim().length < 20) {
    errors.message = "A little more detail helps: at least 20 characters.";
  } else if (values.message.trim().length > 4000) {
    errors.message = "That's a bit long. Please keep it under 4000 characters.";
  }

  if (values.scopeTags.length === 0) {
    errors.scopeTags = "Pick at least one topic.";
  }

  if (!values.budget) {
    errors.budget = "Choose what kind of message this is.";
  }

  return errors;
}
