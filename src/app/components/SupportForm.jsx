"use client";
import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  "Bug Report",
  "Feature Request",
  "Account Issue",
  "Technical Support",
  "General Question",
];

const PRIORITIES = ["Low", "Medium", "High", "Critical"];

const AFFECTED_PRODUCTS = [
  "Apex Legends Stats",
  "Fortnite Stats",
  "League of Legends Stats",
  "Daily Horoscope",
  "Pet Battles",
  "Squid Games",
  "Welcome Messages",
  "Premium / Billing",
  "Discord Bot (General)",
  "Website / Other",
];

const PRIORITY_RESPONSE_TIMES = {
  Low: "5–7 business days",
  Medium: "2–3 business days",
  High: "1 business day",
  Critical: "Within a few hours",
};

const PRIORITY_COLORS = {
  Low: "text-blue-400",
  Medium: "text-yellow-400",
  High: "text-orange-400",
  Critical: "text-red-400",
};

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1 text-sm text-red-400">{message}</p>;
}

function Label({ htmlFor, required, children }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">
      {children}
      {required && <span className="ml-1 text-red-400">*</span>}
    </label>
  );
}

const inputBase =
  "w-full rounded-lg border bg-gray-900/70 px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors";
const inputValid = "border-white/10 focus:border-purple-500 focus:ring-purple-500/20";
const inputError = "border-red-500/60 focus:border-red-500 focus:ring-red-500/20";

export default function SupportForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    priority: "",
    description: "",
    stepsToReproduce: "",
    affectedProduct: "",
    systemInfo: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [serverError, setServerError] = useState("");
  const [successData, setSuccessData] = useState(null);
  const formRef = useRef(null);

  // Auto-capture browser/system info
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      setForm((prev) => ({ ...prev, systemInfo: navigator.userAgent }));
    }
  }, []);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) {
      errs.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) {
      errs.subject = "Subject is required.";
    } else if (form.subject.length > 100) {
      errs.subject = "Subject must be 100 characters or fewer.";
    }
    if (!form.category) errs.category = "Please select a category.";
    if (!form.priority) errs.priority = "Please select a priority.";
    if (!form.description.trim()) {
      errs.description = "Description is required.";
    } else if (form.description.trim().length < 20) {
      errs.description = "Description must be at least 20 characters.";
    }
    if (!form.affectedProduct) errs.affectedProduct = "Please select an affected product.";
    return errs;
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to first error
      const firstErrorKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstErrorKey}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("submitting");
    setServerError("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.status === 429) {
        const wait = data.retryAfter ? ` Please try again in ${data.retryAfter} seconds.` : "";
        setServerError(`Too many requests.${wait}`);
        setStatus("error");
        return;
      }

      if (!res.ok || !data.success) {
        setServerError(data.error || "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      setSuccessData(data);
      setStatus("success");
      // Clear form
      setForm({
        name: "",
        email: "",
        subject: "",
        category: "",
        priority: "",
        description: "",
        stepsToReproduce: "",
        affectedProduct: "",
        systemInfo: typeof navigator !== "undefined" ? navigator.userAgent : "",
      });
      setErrors({});
    } catch (err) {
      console.error("Support form submission error:", err);
      setServerError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "success" && successData) {
    return (
      <div className="rounded-2xl border border-green-500/30 bg-green-900/20 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
          <svg className="h-8 w-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Request Submitted!</h3>
        <p className="text-gray-400 mb-4">
          Your support request has been created. Reference ID:{" "}
          <span className="font-mono font-semibold text-white">{successData.issueId}</span>
        </p>
        <p className="text-sm text-gray-500 mb-6">
          We&apos;ll get back to you at the email you provided. Keep this ID handy if you need to follow up.
        </p>
        <button
          onClick={() => { setStatus("idle"); setSuccessData(null); }}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all duration-300"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name + Email row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div id="field-name">
          <Label htmlFor="name" required>Name</Label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`${inputBase} ${errors.name ? inputError : inputValid}`}
            disabled={status === "submitting"}
          />
          <FieldError message={errors.name} />
        </div>
        <div id="field-email">
          <Label htmlFor="email" required>Email</Label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`${inputBase} ${errors.email ? inputError : inputValid}`}
            disabled={status === "submitting"}
          />
          <FieldError message={errors.email} />
        </div>
      </div>

      {/* Subject */}
      <div id="field-subject">
        <Label htmlFor="subject" required>Subject</Label>
        <div className="relative">
          <input
            id="subject"
            name="subject"
            type="text"
            value={form.subject}
            onChange={handleChange}
            placeholder="Brief summary of your issue"
            maxLength={100}
            className={`${inputBase} ${errors.subject ? inputError : inputValid} pr-20`}
            disabled={status === "submitting"}
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
            {form.subject.length}/100
          </span>
        </div>
        <FieldError message={errors.subject} />
      </div>

      {/* Category + Priority row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div id="field-category">
          <Label htmlFor="category" required>Category</Label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`${inputBase} ${errors.category ? inputError : inputValid} cursor-pointer`}
            disabled={status === "submitting"}
          >
            <option value="" disabled>Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <FieldError message={errors.category} />
        </div>

        <div id="field-affectedProduct">
          <Label htmlFor="affectedProduct" required>Affected Product / Feature</Label>
          <select
            id="affectedProduct"
            name="affectedProduct"
            value={form.affectedProduct}
            onChange={handleChange}
            className={`${inputBase} ${errors.affectedProduct ? inputError : inputValid} cursor-pointer`}
            disabled={status === "submitting"}
          >
            <option value="" disabled>Select a product</option>
            {AFFECTED_PRODUCTS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <FieldError message={errors.affectedProduct} />
        </div>
      </div>

      {/* Priority */}
      <div id="field-priority">
        <Label required>Priority</Label>
        <div className="flex flex-wrap gap-3">
          {PRIORITIES.map((p) => (
            <label
              key={p}
              className={`flex items-center gap-2 cursor-pointer rounded-lg border px-4 py-2.5 transition-all duration-200 ${
                form.priority === p
                  ? "border-purple-500 bg-purple-500/10"
                  : "border-white/10 bg-gray-900/50 hover:border-white/20"
              } ${status === "submitting" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <input
                type="radio"
                name="priority"
                value={p}
                checked={form.priority === p}
                onChange={handleChange}
                className="sr-only"
                disabled={status === "submitting"}
              />
              <span className={`text-sm font-medium ${form.priority === p ? PRIORITY_COLORS[p] : "text-gray-400"}`}>
                {p}
              </span>
            </label>
          ))}
        </div>
        <FieldError message={errors.priority} />
        {form.priority && (
          <p className="mt-2 text-xs text-gray-500">
            Estimated response time:{" "}
            <span className={`font-medium ${PRIORITY_COLORS[form.priority]}`}>
              {PRIORITY_RESPONSE_TIMES[form.priority]}
            </span>
          </p>
        )}
      </div>

      {/* Description */}
      <div id="field-description">
        <Label htmlFor="description" required>Description</Label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Please describe your issue in detail…"
          rows={5}
          className={`${inputBase} resize-y ${errors.description ? inputError : inputValid}`}
          disabled={status === "submitting"}
        />
        <div className="flex justify-between mt-1">
          <FieldError message={errors.description} />
          {!errors.description && (
            <span className={`text-xs ml-auto ${form.description.trim().length < 20 && form.description.length > 0 ? "text-red-400" : "text-gray-500"}`}>
              {form.description.trim().length}/20 min
            </span>
          )}
        </div>
      </div>

      {/* Steps to Reproduce — only shown for Bug Report */}
      {form.category === "Bug Report" && (
        <div id="field-stepsToReproduce">
          <Label htmlFor="stepsToReproduce">Steps to Reproduce</Label>
          <textarea
            id="stepsToReproduce"
            name="stepsToReproduce"
            value={form.stepsToReproduce}
            onChange={handleChange}
            placeholder={"1. Go to …\n2. Click on …\n3. Observe …"}
            rows={4}
            className={`${inputBase} resize-y ${inputValid}`}
            disabled={status === "submitting"}
          />
          <p className="mt-1 text-xs text-gray-500">Optional, but helps us reproduce the issue faster.</p>
        </div>
      )}

      {/* System Info (read-only) */}
      <div>
        <Label htmlFor="systemInfo">Browser / System Info</Label>
        <input
          id="systemInfo"
          name="systemInfo"
          type="text"
          value={form.systemInfo}
          readOnly
          className={`${inputBase} ${inputValid} cursor-not-allowed opacity-60 text-xs font-mono`}
        />
        <p className="mt-1 text-xs text-gray-500">Auto-captured to help us diagnose issues.</p>
      </div>

      {/* Server error */}
      {status === "error" && serverError && (
        <div className="flex items-start gap-3 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-3">
          <svg className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <p className="text-sm text-red-400">{serverError}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "submitting" ? (
          <>
            <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Submitting…
          </>
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Submit Support Request
          </>
        )}
      </button>
    </form>
  );
}
