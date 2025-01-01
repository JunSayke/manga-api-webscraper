import IMangaService from "../interfaces/IMangaService"
import MangahubService from "../services/mangahubService"
import MangakakalotService from "../services/mangakakalotService"
import NhentaiService from "../services/nhentaiService"
// Import other services as needed

// Maybe define it in a JSON file and load it dynamically?
const services: Record<string, IMangaService> = {
	mangakakalot: new MangakakalotService(),
	// mangahub: new MangahubService(),
	// nhentai: new NhentaiService(),
	// Add other services here
}

const serviceFactory = (serviceName: string): IMangaService => {
	const service = services[serviceName]
	if (!service) {
		throw new Error(`Service ${serviceName} not found`)
	}
	return service
}

export default serviceFactory
