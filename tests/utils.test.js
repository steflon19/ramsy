const { filterAllowedDomains, filterRomaguera, filterImages } = require("../src/utils/utils")

const testData = require("./testData.json")

test('filterDomains', () => {
    const filteredUsers = testData.users.filter(filterAllowedDomains)
    expect(filteredUsers.find(u => u.name === "Leanne Graham")).toBeTruthy()
    expect(filteredUsers.length).toBe(2)
})

test('filterRomaguera', () => {
    const romagueraUsers = testData.users.filter(filterRomaguera)
    expect(romagueraUsers.length).toBe(2)
    expect(romagueraUsers.find(u => u.name === "Leanne Graham")).toBeTruthy()
})

test('filterImages', () => {
    let size = 2
    let offset = 1
    let images = testData.photos.filter(d => filterImages(d, size, offset))
    expect(images.length).toBe(2)
    expect(images.find(i => i.id === 2)).toBeTruthy()
    expect(images.find(i => i.id === 3)).toBeTruthy()
    size = 4
    offset = 2
    images = testData.photos.filter(d => filterImages(d, size, offset))
    expect(images.length).toBe(4)
    expect(images.find(i => i.id === 3)).toBeTruthy()
    expect(images.find(i => i.id === 6)).toBeTruthy()
})