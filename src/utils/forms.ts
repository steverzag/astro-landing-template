import { validateEmail, validatePhone } from "./appTools";

type FormFieldValue = string | number | boolean | Date | null | undefined;

type FormFieldValidator = {
  checkRequired?: (value: FormFieldValue) => boolean;
  checkValidation?: (value: FormFieldValue) => boolean;
  requiredErrorMessage?: string;
  validationErrorMessage?: string;
};


const fieldValidations = {
  name: {
    checkRequired: (value: string) => !!value,
    checkValidation: (value: string) => (value).length >= 2,
    requiredErrorMessage: "Name is required",
    validationErrorMessage: "Name must be at least 2 characters",
  } as FormFieldValidator,
  email: {
    checkRequired: (value: string) => !!value,
    checkValidation: (value: string) => validateEmail(value),
    requiredErrorMessage: "Email is required",
    validationErrorMessage: "Email must be valid",
  } as FormFieldValidator,
  phone: {
    checkRequired: (value: string) => !!value,
    checkValidation: (value: string) => validatePhone(value),
    requiredErrorMessage: "Phone Number is required",
    validationErrorMessage: "Phone Number must be valid",
  } as FormFieldValidator,
  message: {
    checkRequired: (value: string) => !!value,
    checkValidation: (value: string) => value.length >= 10,
    requiredErrorMessage: "Message is required",
    validationErrorMessage: "Message must be at least 10 characters",
  } as FormFieldValidator,
};

export const initForm = (form: HTMLFormElement, endpointPath: string) => {
  const inputs = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "input, textarea",
  );
  const formState = form.querySelector(".form-state");
  const dialog = form.closest("dialog");

  const clearState = () =>
    formState?.classList.remove(
      "state-loading",
      "state-success",
      "state-error",
    );

  // When hosted inside a <Modal />, reset fields and state after it closes.
  dialog?.addEventListener("close", () => {
    setTimeout(() => {
      inputs.forEach((input) => {
        input.value = "";
        removeError(input);
      });
      clearState();
    }, 300);
  });

  // Clear a field's error as soon as the user refocuses it.
  inputs.forEach((input) =>
    input.addEventListener("focus", () => removeError(input)),
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const values = Object.fromEntries(new FormData(form)) as Record<
      string,
      string
    >;

    let hasError = false;
    const fail = (name: string, message: string) => {
      const field = form.querySelector<HTMLElement>(`[name="${name}"]`);
      if (field) appendError(message, field);
      hasError = true;
    };

    for (const name in values) {
      if (
        form.querySelector(`[name="${name}"]`)?.hasAttribute("data-required") &&
        !fieldValidations[name as keyof typeof fieldValidations]?.checkRequired?.(values[name])
      ) {
        fail(name, fieldValidations[name as keyof typeof fieldValidations]?.requiredErrorMessage || `${name} is required`);
      } else if (
        form.querySelector(`[name="${name}"]`)?.hasAttribute("data-validate") &&
        !fieldValidations[name as keyof typeof fieldValidations]?.checkValidation?.(values[name])
      ) {
        fail(name, fieldValidations[name as keyof typeof fieldValidations]?.validationErrorMessage || `${name} must be valid`);
      }
    }

    //   if (!values.name) fail("name", "Please insert your Name");
    //   if (!validateEmail(values.email)) fail("email", "Email must be valid");
    //   if (!validatePhone(values.phone)) fail("phone", "Phone Number must be valid");

    if (hasError) return;

    formState?.classList.add("state-loading");

    try {
      const res = await fetch(`/api/${endpointPath}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      clearState();
      formState?.classList.add(res.ok ? "state-success" : "state-error");
    } catch {
      clearState();
      formState?.classList.add("state-error");
    }
  });

  function appendError(message: string, element: Element) {
    removeError(element); // avoid stacking duplicate messages on re-submit
    const errorElement = document.createElement("span");
    errorElement.className = "input-error-message";
    errorElement.innerText = message;
    element.parentNode!.insertBefore(errorElement, element.nextSibling);
  }

  function removeError(element: Element) {
    const next = element.nextSibling;
    if (
      next instanceof HTMLSpanElement &&
      next.classList.contains("input-error-message")
    )
      next.remove();
  }
};
