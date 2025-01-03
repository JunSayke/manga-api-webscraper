import { ElementHandle, Page } from "puppeteer"
import BrowserManager from "../../../../manager/browserManager"
import { PageManager } from "../../../../manager/browserPageManager"
import PuppeteerElementAdapter from "../../../adapter/PuppeteerElementAdapter"
import AbstractBaseScraper from "./AbstractBaseScraper"

class PuppeteerWebscraper extends AbstractBaseScraper {
	private page: Page | null = null

	public elementAdapter = (element: ElementHandle): PuppeteerElementAdapter =>
		new PuppeteerElementAdapter(element)

	public async loadPage(url: string): Promise<void> {
		const browser = BrowserManager.getInstance().getBrowser()

		// Set up a new page using the PageManager
		this.page = await PageManager.setupPage(browser)
		await this.page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 })
	}

	public async cleanup(): Promise<void> {
		// Clean up the current page using PageManager
		if (this.page) {
			await PageManager.cleanupPage(this.page)
			await this.page.close()
			this.page = null
		}
	}

	public async querySelector(selector: string): Promise<ElementHandle[]> {
		if (!this.page) {
			throw new Error("Page not loaded. Call loadPage first.")
		}

		// Return all elements matching the selector
		return await this.page.$$(selector)
	}
}

export default PuppeteerWebscraper
