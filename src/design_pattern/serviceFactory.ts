import IMangaService from "../interfaces/iMangaService"
import MangakakalotService from "../services/mangakakalotService"
// Import other services as needed

const serviceFactory = (serviceName: string): IMangaService => {
	switch (serviceName) {
		case "mangakakalot":
			return new MangakakalotService()
		// Add cases for other services
		default:
			throw new Error("Unknown service")
	}
}

export default serviceFactory
