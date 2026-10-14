"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import styles from "./site.module.css";

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
    <form
      className={styles.enquiryForm}
      onSubmit={submit}
      action="/api/enquiry"
      method="post"
    >
      <div className={styles.formRow}>
        <div>
          <label htmlFor="enquiry-name">Your name</label>
          <input
            id="enquiry-name"
            name="name"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            placeholder="Full name"
          />
        </div>
        <div>
          <label htmlFor="enquiry-email">Email address</label>
          <input
            id="enquiry-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            placeholder="you@example.com"
          />
        </div>
      </div>
      <label htmlFor="enquiry-topic">What brings you here?</label>
      <select
        id="enquiry-topic"
        name="topic"
        defaultValue={partner ? "Partnership" : "Playing and tournaments"}
      >
        <option>Playing and tournaments</option>
        <option>Partnership</option>
        <option>Volunteering and collaboration</option>
        <option>General enquiry</option>
      </select>
      <label htmlFor="enquiry-message">Your message</label>
      <textarea
        id="enquiry-message"
        name="message"
        required
        minLength={10}
        maxLength={5000}
        rows={5}
        placeholder="Tell us a little about your enquiry…"
      />
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="enquiry-website">Leave this field empty</label>
        <input
          id="enquiry-website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <label className={styles.consent}>
        <input type="checkbox" name="consent" required value="yes" />
        <span>
          I agree to the Trust using these details to respond to my enquiry.{" "}
          <Link href="/privacy">Privacy notice</Link>
        </span>
      </label>
      <button
        className={styles.buttonDark}
        type="submit"
        disabled={status === "sending"}
      >
        {status === "sending" ? "Sending…" : "Send your enquiry"}
        <span aria-hidden="true">↗</span>
      </button>
      <p
        ref={feedback}
        tabIndex={-1}
        className={status === "error" ? styles.formError : styles.formFeedback}
        role={status === "error" ? "alert" : "status"}
        aria-live="polite"
      >
        {message}
      </p>
      <p className={styles.formNote}>
        Prefer email? <a href={`mailto:${email}`}>{email}</a>
      </p>
    </form>
  );
}
