export async function getGagesByState(stateName) { 
    let url = `https://db-worker.nwai.workers.dev/gages?state=${stateName}`
    let gageInfo = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log("error:", error);
            return []
        })
    console.log("Fetched", gageInfo.length, "gages from Database with parameter", stateName)
    return gageInfo
}

// fetch('https://db-worker.nwai.workers.dev/states').then(res => res.json()).then(console.log);

// fetch('https://db-worker.nwai.workers.dev/gages?state=Massachusetts').then(res => res.json()).then(console.log);

// fetch('https://db-worker.nwai.workers.dev/data?site=1010070&begin=2010-01-01&end=2010-01-07')
//   .then(res => res.json())
//   .then(console.log);