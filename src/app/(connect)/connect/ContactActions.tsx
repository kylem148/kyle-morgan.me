"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
  type ComponentProps,
  type FormEvent,
  type ReactNode,
} from "react";
import { exchangeContact, type ExchangeState } from "./actions";
import styles from "./connect.module.css";
import { CloseIcon, DownloadIcon } from "./icons";
import { PROFILE } from "./profile";

const VCARD_HREF = "/connect/kyle-morgan.vcf";
const INITIAL_STATE: ExchangeState = { status: "idle" };

export default function ContactActions() {
  const [open, setOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);
  // After a successful send, the next open starts from a blank form.
  const resetOnOpen = useRef(false);

  const openSheet = () => {
    if (resetOnOpen.current) {
      resetOnOpen.current = false;
      setFormKey((key) => key + 1);
    }
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <div className={styles.actions}>
        <button type="button" className={styles.bigButton} onClick={openSheet}>
          <span className={styles.buttonLabel}>Exchange Contact</span>
        </button>
        <a
          href={VCARD_HREF}
          className={`${styles.bigButton} ${styles.iconButton}`}
          aria-label="Save contact"
        >
          <DownloadIcon />
        </a>
      </div>

      <Sheet open={open} title="Exchange Contact" onClose={() => setOpen(false)}>
        <ExchangeForm
          key={formKey}
          onDone={() => {
            resetOnOpen.current = true;
            setOpen(false);
          }}
        />
      </Sheet>
    </>
  );
}

function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus into the sheet while it is open and hand it back on close.
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus({ preventScroll: true });
    return () => previous?.focus({ preventScroll: true });
  }, [open]);

  return (
    <div
      className={styles.overlay}
      data-open={open}
      inert={!open}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.sheet} role="dialog" aria-modal="true" aria-label={title}>
        <div className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle}>{title}</h2>
          <button
            ref={closeRef}
            type="button"
            className={styles.closeButton}
            aria-label="Close"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ExchangeForm({ onDone }: { onDone: () => void }) {
  const id = useId();
  const [state, formAction, pending] = useActionState(exchangeContact, INITIAL_STATE);

  // Dispatch in a transition instead of using <form action>, which clears every field
  // once the action returns, including when it returns a validation error.
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => formAction(formData));
  };

  if (state.status === "sent") {
    return (
      <div className={styles.sent} role="status">
        <p className={styles.sentTitle}>Sent.</p>
        <p className={styles.sentText}>{PROFILE.firstName} got your message.</p>
        <button
          type="button"
          className={`${styles.bigButton} ${styles.sheetButton} ${styles.doneButton}`}
          onClick={onDone}
        >
          <span className={styles.buttonLabel}>Done</span>
        </button>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={submit}>
      <p className={styles.intro}>
        Send <strong>{PROFILE.firstName}</strong> a quick email. Include as much or as little as you
        like.
      </p>

      <div className={styles.fields}>
        <Field id={`${id}-name`} label="Name" name="name" placeholder="Your name" autoComplete="name" maxLength={100} />
        <Field
          id={`${id}-email`}
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          maxLength={254}
        />
        <Field
          id={`${id}-phone`}
          label="Phone"
          name="phone"
          type="tel"
          placeholder="Your number"
          autoComplete="tel"
          maxLength={40}
        />
        <div className={styles.noteGroup}>
          <label className={styles.label} htmlFor={`${id}-note`}>
            Note
          </label>
        </div>
        <div className={`${styles.field} ${styles.noteField}`}>
          <textarea
            id={`${id}-note`}
            className={`${styles.input} ${styles.textarea}`}
            name="note"
            placeholder="Where we met, what you're working on..."
            maxLength={2000}
            rows={3}
          />
        </div>
      </div>

      {/* Bots fill every field; people never see this one. */}
      <input className={styles.honeypot} name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      {state.status === "error" && (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      )}

      <div className={styles.submitWrap}>
        <button type="submit" className={`${styles.bigButton} ${styles.sheetButton}`} disabled={pending}>
          <span className={styles.buttonLabel}>{pending ? "Sending..." : `Send to ${PROFILE.firstName}`}</span>
        </button>
      </div>
    </form>
  );
}

function Field({ id, label, ...input }: { id: string; label: string } & ComponentProps<"input">) {
  return (
    <div>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      <div className={styles.field}>
        <input id={id} className={styles.input} {...input} />
      </div>
    </div>
  );
}
