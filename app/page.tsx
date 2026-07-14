import ContactForm from '@/components/ContactForm';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-4xl space-y-8 text-center">
        <header className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have a question or want to work together? Fill out the form below and we'll get back to you as soon as possible.
          </p>
        </header>

        <section className="flex justify-center">
          <ContactForm />
        </section>
      </div>
    </main>
  );
}
