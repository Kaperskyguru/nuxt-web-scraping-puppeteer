const puppeteer = require('puppeteer')
const jobUrl = `https://www.dice.com/jobs?q=backend&countryCode=US&radius=30&radiusUnit=mi&page=1&pageSize=20&filters.postedDate=ONE&filters.isRemote=true&language=en` // SITE URL HERE
let page
let browser
let cardArr = []
class Jobs {
  // We will add 3 methods here

  // Initializes and create puppeteer instance
  static async init() {
    browser = await puppeteer.launch({
      // headless: false,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process', // <- this one doesn't works in Windows
        '--disable-gpu',
      ],
    })

    page = await browser.newPage()
    await Promise.race([
      await page.goto(jobUrl, { waitUntil: 'networkidle2' }).catch(() => {}),
      await page.waitForSelector('.search-card').catch(() => {}),
    ])
  }

  // Visits the page, retrieves the job
  static async resolver() {
    await this.init()
    const jobURLs = await page.evaluate(() => {
      const cards = document.querySelectorAll('.search-card')
      cardArr = Array.from(cards)
      const cardLinks = []
      cardArr.map((card) => {
        const cardTitle = card.querySelector('.card-title-link')
        const cardDesc = card.querySelector('.card-description')
        const cardCompany = card.querySelector(
          'a[data-cy="search-result-company-name"]'
        )
        const cardDate = card.querySelector('.posted-date')
        const { text } = cardTitle
        const { host } = cardTitle
        const { protocol } = cardTitle
        const pathName = cardTitle.pathname
        const query = cardTitle.search
        const titleURL = protocol + '//' + host + pathName + query
        const company = cardCompany.textContent
        cardLinks.push({
          titleText: text,
          titleURLHost: host,
          titleURLPathname: pathName,
          titleURLSearchQuery: query,
          titleURL: titleURL,
          titleDesc: cardDesc.innerHTML,
          titleCompany: company,
          titleDate: cardDate.textContent,
        })
      })
      return cardLinks
    })
    return jobURLs
  }

  // Converts the job to array
  static async getJobs() {
    const jobs = await this.resolver()
    await browser.close()
    const data = {}
    data.jobs = this.resolveJob(jobs)
    data.total_jobs = jobs.length
    return data
  }

  static resolveJob(jobs) {
    const resolvedJob = jobs.map((job) => {
      const resolvedJob = {}
      resolvedJob.title = job.titleText
      resolvedJob.website = job.titleURLHost
      resolvedJob.description = job.titleDesc
      resolvedJob.url = job.titleURL
      resolvedJob.company = job.titleCompany
      resolvedJob.date = job.titleDate
      return resolvedJob
    })
    return resolvedJob
  }
}
export default Jobs
