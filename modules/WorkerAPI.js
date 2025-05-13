/**
 * @returns Array of Objects, one for every gage point in stateName
 */
async function getGagesByState(stateName) { 
    let url = `https://db-worker.nwai.workers.dev/gages?state=${stateName}`
    let gageInfo = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log("error:", error);
            return []
        })
    //console.log("Fetched", gageInfo.length, "gages from Database with parameter", stateName)
    return gageInfo
}

/**
 * @returns Array of Objects, one for every database entry associated with gageID and between beginDate and endDate
 */
async function getStatsByGageID(gageID, beginDate, endDate) { 
    let url = `https://db-worker.nwai.workers.dev/data?site=${gageID}&begin=${beginDate}&end=${endDate}`
    let stats = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log("error:", error);
            return []
        })
    //console.log(stats)
    //console.log("Fetched", stats.length, "gage data entries from Database with siteID", gageID, "Date Range", beginDate, "to", endDate)
    return stats
}

/**
 * @returns Array of Objects, one for each database entry associated with gageID
 */
async function getGageInfoByGageID(gageID) { 
    let url = `https://db-worker.nwai.workers.dev/gageInfo?site_number=${gageID}`
    let stats = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log("error:", error);
            return []
        })
    //console.log(stats)
    //console.log("Fetched", stats.length, "gage info from gage ID = ", gageID)
    return (stats.length > 0)? stats[0] : null
}

/**
 * @returns Array of States
 */
async function getStates() { 
    let url = `https://db-worker.nwai.workers.dev/states`
    let data = await fetch(url)
        .then(res => res.json())
        .catch((error) => {
            console.log("error:", error);
            return []
        })
    //console.log("Fetched", data.length, "states from Database")
    return data.map(entry => entry.state)
}