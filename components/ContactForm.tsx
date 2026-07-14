"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message is too long (max 500 chars)"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Form data submitted:", data);
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 transition-all">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Contact Us</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2">We'd love to hear from you. Please fill out the form below.</p>
      </div>

      {isSuccess ? (
        <div className="flex flex-col items-center justify-center py-8 text-center animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
          <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Message Sent!</h3>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">Thank you for reaching out. We'll get back to you soon.</p>
          <button 
            onClick={() => setIsSuccess(false)}
            className="mt-6 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-4"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Name
            </label>
            <input
              {...register("name")}
              type="text"
              id="name"
              placeholder="John Doe"
              className={`w-full px-4 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 outline-none transition-all focus:ring-2 ${
                errors.name 
                  ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30" 
                  : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-200 dark:focus:ring-blue-900/30 focus:border-blue-500"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              id="email"
              placeholder="john@example.com"
              className={`w-full px-4 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 outline-none transition-all focus:ring-2 ${
                errors.email 
                  ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30" 
                  : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-200 dark:focus:ring-blue-900/30 focus:border-blue-500"
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Subject
            </label>
            <input
              {...register("subject")}
              type="text"
              id="subject"
              placeholder="How can we help?"
              className={`w-full px-4 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 outline-none transition-all focus:ring-2 ${
                errors.subject 
                  ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30" 
                  : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-200 dark:focus:ring-blue-900/30 focus:border-blue-500"
              }`}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.subject.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Message
            </label>
            <textarea
              {...register("message")}
              id="message"
              rows={4}
              placeholder="Your message here..."
              className={`w-full px-4 py-2 rounded-lg border bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 outline-none transition-all focus:ring-2 resize-none ${
                errors.message 
                  ? "border-red-500 focus:ring-red-200 dark:focus:ring-red-900/30" 
                  : "border-zinc-300 dark:border-zinc-700 focus:ring-blue-200 dark:focus:ring-blue-900/30 focus:border-blue-500"
              }`}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500 font-medium">{errors.message.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Message
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
