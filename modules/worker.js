export default {
    async fetch(request) {
      const url = new URL(request.url);
      const query = url.searchParams.get("q");
  
      if (!query) {
        return new Response("Please provide a query using ?q=your-query", {
          status: 400,
        });
      }
  
      // Example logic: return a simple message
      return new Response(`You searched for: ${query}`, {
        headers: { "Content-Type": "text/plain" },
      });
    },
  };



// fetch('https://db-worker.nwai.workers.dev/states').then(res => res.json()).then(console.log);

// fetch('https://db-worker.nwai.workers.dev/gages?state=Massachusetts').then(res => res.json()).then(console.log);

// fetch('https://db-worker.nwai.workers.dev/data?site=1010070&begin=2010-01-01&end=2010-01-07')
//   .then(res => res.json())
//   .then(console.log);