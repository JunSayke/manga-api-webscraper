import IMangaService from "../interfaces/iMangaService"
import MangahubService from "../services/mangahubService"
import MangakakalotService from "../services/mangakakalotService"
import NhentaiService from "../services/nhentaiService"
// Import other services as needed

const serviceFactory = (serviceName: string): IMangaService => {
	switch (serviceName) {
		case "mangakakalot":
			return new MangakakalotService()
		case "mangahub":
			return new MangahubService()
        case "nhentai":
            return new NhentaiService()
		// Add cases for other services
		default:
			throw new Error("Unknown service")
	}
}

export default serviceFactory
