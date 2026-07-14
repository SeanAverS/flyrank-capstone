"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

// Define the validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log('Form submitted:', data);
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();

    // Reset success message after 5 seconds
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Contact Us</h2>
      
      {isSuccess && (
        <div 
          role="alert" 
          aria-live="polite"
          className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3 text-green-700"
        >
          <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold">Success!</p>
            <p className="text-sm">Your message has been sent successfully. We'll get back to you soon.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Name Field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="name" 
            className="block text-sm font-medium text-slate-700"
          >
            Name
          </label>
          <div className="relative">
            <input
              {...register('name')}
              type="text"
              id="name"
              disabled={isSubmitting}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
              className={`w-full px-4 py-2 bg-slate-50 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:border-blue-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="John Doe"
            />
          </div>
          {errors.name && (
            <p 
              id="name-error" 
              role="alert" 
              className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="email" 
            className="block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <div className="relative">
            <input
              {...register('email')}
              type="email"
              id="email"
              disabled={isSubmitting}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              className={`w-full px-4 py-2 bg-slate-50 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 ${
                errors.email 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:border-blue-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="john@example.com"
            />
          </div>
          {errors.email && (
            <p 
              id="email-error" 
              role="alert" 
              className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Message Field */}
        <div className="space-y-1.5">
          <label 
            htmlFor="message" 
            className="block text-sm font-medium text-slate-700"
          >
            Message
          </label>
          <div className="relative">
            <textarea
              {...register('message')}
              id="message"
              rows={4}
              disabled={isSubmitting}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
              className={`w-full px-4 py-2 bg-slate-50 border rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-blue-500/20 resize-none ${
                errors.message 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-slate-200 focus:border-blue-500'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              placeholder="How can we help you?"
            />
          </div>
          {errors.message && (
            <p 
              id="message-error" 
              role="alert" 
              className="text-xs font-medium text-red-500 flex items-center gap-1 mt-1"
            >
              <AlertCircle className="w-3 h-3" />
              {errors.message.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-all duration-200 hover:bg-blue-700 active:scale-[0.98] focus:ring-4 focus:ring-blue-500/30 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
