export default eventHandler(async () => {

    const storage = useStorage('data')

    let pageVisits = (await storage.getItem('pageVisits'))
    const updatedPageVisits = pageVisits + 1
    await storage.setItem('pageVisits', updatedPageVisits)
    return {
        pageVisits: updatedPageVisits,
    }
})
