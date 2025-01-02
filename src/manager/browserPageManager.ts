// TODO Implement pool of pages
import { Browser, Page } from "puppeteer"
export class PageManager {
	private static readonly USER_AGENT =
		"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"

	public static async setupPage(
		browser: Browser,
		timeout: number = 30000
	): Promise<Page> {
		const page = await browser.newPage()
		await page.setUserAgent(this.USER_AGENT)
		await page.setRequestInterception(true)
		page.on("request", (req) => {
			const resourceType = req.resourceType()
			if (!["document", "xhr", "fetch"].includes(resourceType)) {
				return req.abort()
			}
			req.continue()
		})
		page.setDefaultNavigationTimeout(timeout)
		return page
	}

	public static async cleanupPage(page: Page): Promise<void> {
		await page.evaluate(() => {
			window.gc?.()
		})
	}
}
