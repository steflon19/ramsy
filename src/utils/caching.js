/** Contains request elements of the form { path: string, response: any, fetchTime: number} 
 * Can be used to look up cached responses and store new responses
*/
const Cache = []

// Cache for 10 seconds
const timeToLive = 10 * 1000

/** Searches in Cache for the given request 
 * @param {string} path The requested route
 * 
 * @returns {any} The cached response for the requested path or `null` if not cached or outdated
 */
const getFromCache = (path) => {
    const cachedEntry = Cache.find(c => c.path === path)
    if (!isExpired(cachedEntry)) {
        return cachedEntry.response
    } else {
        return null
    }
}

/** Stores a given response in the cache
 * 
 * @param {string} path The requested route
 * @param {any} reponse The reponse received for this request
 */
const storeInCache = (path, response) => {
    // Check if an old cache entry should be removed first
    removeFromCache(path)
    Cache.push({
        path,
        response,
        fetchTime: new Date().getTime()
    })
}

/** Determines if the cache entry is expired
 * 
 * @returns {boolean} The cached response for the requested path or none if not cached or outdated
 */
const isExpired = (cacheEntry) => {
    if (!cacheEntry) {
        return true
    }
    if ((cacheEntry?.fetchTime + timeToLive) < new Date().getTime()) {
        // actually expired, remove from cache
        removeFromCache(cacheEntry.path)
        return true
    }
    return false
}

/** Removes the given path from the cache
 * 
 * @param {string} string The path to remove
 */
const removeFromCache = (path) => {
    const containsIndex = Cache.findIndex(c => c.path === path)
    if (containsIndex >= 0) {
        Cache.splice(containsIndex, 1)
    }
}
module.exports = { getFromCache, storeInCache }