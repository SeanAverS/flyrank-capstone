// For Assignment FE-4: Health Check dynamically renders fetched data from random joke API 

type JokeResponse = {
  setup: string;
  punchline: string;
};

export default async function HealthCheck() {
  let joke: JokeResponse | null = null;
  let status = "Healthy";

  try {
    const res = await fetch("https://official-joke-api.appspot.com/random_joke", {
      cache: "no-store", 
    });
    if (res.ok) {
      joke = await res.json();
    } else {
      status = "Degraded (API issue)";
    }
  } catch (error) {
    status = "Degraded (Network issue)";
  }

  return (
    <div className="mx-auto max-w-xl p-6 mt-12">
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          System Status: 
          <span className={status === "Healthy" ? "text-emerald-400" : "text-amber-500"}>
            {status}
          </span>
        </h1>
        
        <div className="mt-3 p-3 border-t border-slate-700">
          <h1 className="tracking-wider text-slate-400 font-bold">API Check: New Joke Every Render</h1>
          {joke ? (
            <div className="mt-2 text-md">
              <p className="font-semibold text-slate-200">Q: {joke.setup}</p>
              <p className="text-emerald-400 font-semibold mt-1">A: {joke.punchline}</p>
            </div>
          ) : (
            <p className="text-slate-500 text-md mt-2">Failed to fetch dynamic API test payload.</p>
          )}
        </div>
      </div>
    </div>
  );
}