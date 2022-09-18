/** The allowed domains for users websites */
const allowedDomains = ['com', 'net', 'org']

/**
 * Determines if a given user hosts their website on an allowed domain
 * 
 * @returns {boolean} if users website is on allowed domain
 */
const filterAllowedDomains = (d) => {
    return allowedDomains.includes(d.website.split('.').pop())
}

/** 
 * Filters a given array containing user elements with company.name attributes for the Romaguera group
 * 
 * @returns {boolean} if user works in Romaguera
 */
const filterRomaguera = d => d.company?.name?.indexOf('Romaguera') >= 0

/** 
 * Sort a given array containing elements with address.city attributes alphabetically by the given city
*/
const sortByCity = (a, b) => a.address.city.localeCompare(b.address.city)

/**
 * Filters an array of images depending on offset and size parameters
 *
 * @param {object} d The data element to be checked
 * @param {number} size The amount of elements to be returned
 * @param {number} offset The offset from 0 for the requested ids
 * 
 * @returns {boolean} if image id is within given range
 */
const filterImages = (d, size, offset) => d.id > offset && (d.id <= (offset + size))

/** 
 * Utility function to convert request responses according to status.
 * 
 * @returns {Promise} Resolve or Reject depending on the status of the given request
 */
const status = response => {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
    }
    return Promise.reject(new Error(response.statusText));
};

/** Utility function to convert a http request response to JSON
 * @returns The response converted to json format */
const json = response => response.json();

module.exports = { filterAllowedDomains, filterRomaguera, filterImages, sortByCity, json, status }