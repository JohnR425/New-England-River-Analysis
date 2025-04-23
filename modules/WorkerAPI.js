async function getGagesByState(stateName) { 
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

async function getStatsByGageID(gageID, beginDate, endDate) { 
    let url = `https://db-worker.nwai.workers.dev/data?site=${gageID}&begin=${beginDate}&end=${endDate}`
    let stats = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log("error:", error);
            return []
        })
    console.log(stats)
    console.log("Fetched", stats.length, "gage data entries from Database with siteID", gageID, "Date Range", beginDate, "to", endDate)
    return stats
}

async function getStates() { 
    let url = `https://db-worker.nwai.workers.dev/states}`
    let data = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log("error:", error);
            return []
        })
    console.log("Fetched", data.length, "states from Database")
    return data
}

// RETURNS

// {
//     site_number: 1010070,
//     state: 'Maine',
//     latitude: 46.89388889,
//     longitude: -69.7516667,
//     elevation: 1073,
//     site_name: 'Big Black River near Depot Mtn, Maine',
//     date: '2010-01-07',
//     mean_discharge: 110,
//     ppt: 0.02,
//     tmean: 23.7
//   }

// fetch('https://db-worker.nwai.workers.dev/states').then(res => res.json()).then(console.log);
// fetch('https://db-worker.nwai.workers.dev/gages?state=Massachusetts').then(res => res.json()).then(console.log);
// fetch('https://db-worker.nwai.workers.dev/data?site=1010070&begin=2010-01-01&end=2010-01-07')
//   .then(res => res.json())
//   .then(console.log);