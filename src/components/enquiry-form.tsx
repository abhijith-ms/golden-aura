"use client";

import React, { useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CaretDown,
  CheckCircle,
  WarningCircle,
} from "@phosphor-icons/react";
import styles from "./enquiry-form.module.css";

export function EnquiryForm({
  partner = false,
  email,
}: {
  partner?: boolean;
  email: string;
}) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");
  const feedback = useRef<HTMLParagraphElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setMessage("Sending your enquiry…");
    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(
          result.error ||
            "Your enquiry could not be sent. Please try again or email us directly.",
        );
      setStatus("success");
      setMessage("Thank you. Your enquiry has been sent to the Trust.");
      form.reset();
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Your enquiry could not be sent. Please email us directly.",
      );
    }
    requestAnimationFrame(() => feedback.current?.focus());
  }

  return (
    <div className={styles.formCard}>
      <div className={styles.formCardGlow} aria-hidden="true" />
      <div className={styles.formHeader}>
        <div className={styles.formBadge}>
          <span className={styles.formLiveDot} aria-hidden="true" />
          <span>{partner ? "PARTNERSHIP INTAKE" : "DIRECT ENQUIRY"}</span>
        </div>
        <span className={styles.responseTime}>⚡ 24–48h response</span>
      </div>
      <form
        className={styles.formContent}
        onSubmit={submit}
        action="/api/enquiry"
        method="post"
      >
        <div className={styles.formRow}>
          <div className={styles.formField}>
            <label htmlFor="enquiry-name" className={styles.fieldLabel}>
              Your name <span className={styles.requiredDot}>*</span>
            </label>
            <input
              id="enquiry-name"
              name="name"
              autoComplete="name"
              required
              minLength={2}
              maxLength={100}
              placeholder="Full name"
              className={styles.formInput}
            />
          </div>
          <div className={styles.formField}>
            <label htmlFor="enquiry-email" className={styles.fieldLabel}>
              Email address <span className={styles.requiredDot}>*</span>
            </label>
            <input
              id="enquiry-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              className={styles.formInput}
            />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="enquiry-topic" className={styles.fieldLabel}>
            What brings you here?
          </label>
          <div className={styles.selectWrapper}>
            <select
              id="enquiry-topic"
              name="topic"
              defaultValue={partner ? "Partnership" : "Playing and tournaments"}
              className={styles.formSelect}
            >
              <option value="Playing and tournaments">Playing and tournaments</option>
              <option value="Partnership">Partnership</option>
              <option value="Volunteering and collaboration">Volunteering and collaboration</option>
              <option value="General enquiry">General enquiry</option>
            </select>
            <CaretDown size={14} weight="bold" className={styles.selectChevron} />
          </div>
        </div>

        <div className={styles.formField}>
          <label htmlFor="enquiry-message" className={styles.fieldLabel}>
            Your message <span className={styles.requiredDot}>*</span>
          </label>
          <textarea
            id="enquiry-message"
            name="message"
            required
            minLength={10}
            maxLength={5000}
            rows={5}
            placeholder="Tell us a little about your enquiry…"
            className={styles.formTextarea}
          />
        </div>

        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="enquiry-website">Leave this field empty</label>
          <input
            id="enquiry-website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <label className={styles.consentRow}>
          <input
            type="checkbox"
            name="consent"
            required
            value="yes"
            className={styles.consentCheckbox}
          />
          <span className={styles.consentText}>
            I agree to the Trust using these details to respond to my enquiry.{" "}
            <Link href="/privacy" className={styles.privacyLink}>
              Privacy notice
            </Link>
          </span>
        </label>

        <button
          className={styles.submitButton}
          type="submit"
          disabled={status === "sending"}
        >
          {status === "sending" ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Sending your enquiry…</span>
            </>
          ) : (
            <>
              <span>Send your enquiry</span>
              <ArrowUpRight size={17} weight="bold" className={styles.buttonArrow} />
            </>
          )}
        </button>

        {message && (
          <p
            ref={feedback}
            tabIndex={-1}
            className={status === "error" ? styles.formError : styles.formFeedback}
            role={status === "error" ? "alert" : "status"}
            aria-live="polite"
          >
            {status === "error" ? (
              <WarningCircle size={18} weight="bold" />
            ) : (
              <CheckCircle size={18} weight="bold" />
            )}
            <span>{message}</span>
          </p>
        )}

        <p className={styles.formNote}>
          Prefer email?{" "}
          <a href={`mailto:${email}`} className={styles.emailDirectLink}>
            {email} <ArrowUpRight size={13} weight="bold" />
          </a>
        </p>
      </form>
    </div>
  );
}
