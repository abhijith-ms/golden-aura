import test from "node:test";
import assert from "node:assert/strict";
import {
  validateEnquiry,
  takeQuota,
  handleEnquiry,
  deliverEnquiry,
} from "../src/lib/enquiry.ts";

const valid = {
  name: "Chess Player",
  email: "player@example.com",
  topic: "General enquiry",
  message: "Please share the next tournament dates.",
  consent: "yes",
  website: "",
};
test("validates consent, bounds, topics, honeypot, and header injection", () => {
  assert.equal(validateEnquiry(valid).name, "Chess Player");
  for (const changes of [
    { name: "X" },
    { name: "Name\r\nBcc: attacker" },
    { email: "name@example.com\r\nBcc: attacker" },
    { email: "invalid" },
    { topic: "Injected subject" },
    { message: "short" },
    { message: "x".repeat(5001) },
    { consent: "no" },
    { website: "spam" },
  ])
    assert.throws(() => validateEnquiry({ ...valid, ...changes }));
});
test("quotas expire after fifteen minutes", () => {
  for (let i = 0; i < 5; i++) assert.equal(takeQuota("quota-test", 1000), true);
  assert.equal(takeQuota("quota-test", 1001), false);
  assert.equal(takeQuota("quota-test", 901001), true);
});
const request = (body: unknown, origin = "http://localhost:3000") =>
  new Request("http://localhost:3000/api/enquiry", {
    method: "POST",
    headers: { origin, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
test("rejects foreign origins and oversized requests before delivery", async () => {
  let sent = false;
  const send = async () => {
    sent = true;
  };
  assert.equal(
    (await handleEnquiry(request(valid, "https://other.example"), send)).status,
    403,
  );
  assert.equal(
    (
      await handleEnquiry(
        request({ ...valid, message: "x".repeat(25000) }),
        send,
      )
    ).status,
    413,
  );
  assert.equal(sent, false);
});
test("only reports success after delivery and preserves provider failures", async () => {
  let sent = false;
  assert.equal(
    (
      await handleEnquiry(request(valid), async (data) => {
        assert.equal(data.email, valid.email);
        sent = true;
      })
    ).status,
    200,
  );
  assert.equal(sent, true);
  assert.equal(
    (
      await handleEnquiry(
        request({ ...valid, email: "failure@example.com" }),
        async () => {
          throw new Error("private SMTP details");
        },
      )
    ).status,
    502,
  );
});
test("unconfigured SMTP never reports success", async () => {
  const old = process.env.SMTP_HOST;
  delete process.env.SMTP_HOST;
  try {
    await assert.rejects(
      deliverEnquiry(validateEnquiry(valid)),
      /could not be sent/,
    );
  } finally {
    if (old !== undefined) process.env.SMTP_HOST = old;
  }
});


test("untrusted forwarded hosts cannot bypass enquiry origin validation", async () => {
  let sent = false;
  const forged = new Request("https://goldenaura.example/api/enquiry", {
    method: "POST",
    headers: {
      origin: "https://attacker.example",
      "x-forwarded-host": "attacker.example",
      "content-type": "application/json",
    },
    body: JSON.stringify(valid),
  });
  assert.equal((await handleEnquiry(forged, async () => { sent = true; })).status, 403);
  assert.equal(sent, false);
});


test("accepts the requested host when Next uses an internal listen address", async () => {
  const local = new Request("http://127.0.0.1:3000/api/enquiry", {
    method: "POST",
    headers: {
      host: "localhost:3000",
      origin: "http://localhost:3000",
      "content-type": "application/json",
    },
    body: JSON.stringify({ ...valid, email: "host-check@example.com" }),
  });
  let sent = false;
  assert.equal((await handleEnquiry(local, async () => { sent = true; })).status, 200);
  assert.equal(sent, true);
});
