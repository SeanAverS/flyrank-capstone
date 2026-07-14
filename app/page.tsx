import ContactForm from "@/components/ContactForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl text-center mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
          Have questions or feedback? We're here to help.
        </p>
      </div>

      <ContactForm />
      
      <footer className="mt-16 text-sm text-zinc-500 dark:text-zinc-500">
        &copy; {new Date().getFullYear()} FlyRank Capstone. All rights reserved.
      </footer>
    </main>
  );
}
