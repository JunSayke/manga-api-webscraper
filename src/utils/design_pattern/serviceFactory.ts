import IMangaService from "../../interfaces/IMangaService"
import MangahubService from "../../services/mangahubService"
import MangakakalotService from "../../services/mangakakalotService"
import NHentaiService from "../../services/nhentaiService"
// Import other services as needed

const services: Record<string, IMangaService> = {
	mangakakalot: new MangakakalotService(),
	// mangahub: new MangahubService(),
	// nhentai: new NHentaiService(),
	// Add other services here
}

const domainToServiceMap: Record<string, string> = {
	"mangakakalot.com": "mangakakalot",
	"mangahub.io": "mangahub",
	// Add other domain mappings here
}

const getServiceNameFromDomain = (domain: string): string | undefined => {
	return domainToServiceMap[domain]
}

const serviceFactory = (serviceName: string): IMangaService => {
	const service = services[serviceName]
	if (!service) {
		throw new Error(`Service ${serviceName} not found`)
	}
	return service
}

export { getServiceNameFromDomain, serviceFactory }
