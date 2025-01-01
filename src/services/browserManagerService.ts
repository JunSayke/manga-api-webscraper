// src/services/browserManager.ts
import puppeteer, { Browser } from "puppeteer";

class BrowserManager {
    private static instance: BrowserManager;
    private browser: Browser | null = null;

    private constructor() {}

    public static getInstance(): BrowserManager {
        if (!BrowserManager.instance) {
            BrowserManager.instance = new BrowserManager();
        }
        return BrowserManager.instance;
    }

    public async initializeBrowser(): Promise<void> {
        if (!this.browser) {
            try {
                this.browser = await puppeteer.launch({
                    headless: true,
                    args: ["--no-sandbox", "--disable-setuid-sandbox"],
                });
            } catch (err) {
                console.error("Error launching Puppeteer:", err);
                throw new Error("Failed to launch browser");
            }
        }
    }

    public getBrowser(): Browser {
        if (!this.browser) {
            throw new Error("Browser not initialized. Call initializeBrowser first.");
        }
        return this.browser;
    }

    public async closeBrowser(): Promise<void> {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

export default BrowserManager;