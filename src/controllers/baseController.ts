// Handle the logic for each endpoint
import { Request, Response } from "express"
import {
	getServiceNameFromDomain,
	serviceFactory,
} from "../utils/design_pattern/serviceFactory"
import { URL } from "url"

// TODO: Error handling
export const getMangasByTitle = async (req: Request, res: Response) => {
	const { title, maxResults } = req.query
	const { service } = req.params
	try {
		const mangaService = serviceFactory(service as string)
		const mangas = await mangaService.getMangasByTitle(
			title as string,
			maxResults ? parseInt(maxResults as string) : undefined
		)
		res.json(mangas)
	} catch (error: any) {
		res.status(500).send("Error fetching mangas by title: " + error.message)
	}
}

export const getMangasByGenres = async (req: Request, res: Response) => {
	const { genres, maxResults } = req.query
	const { service } = req.params
	try {
		const mangaService = serviceFactory(service as string)
		const genresArray = (genres as string).split(",")
		const mangas = await mangaService.getMangasByGenres(
			genresArray,
			maxResults ? parseInt(maxResults as string) : undefined
		)
		res.json(mangas)
	} catch (error: any) {
		res.status(500).send("Error fetching mangas by genres: " + error.message)
	}
}

export const getMangasByStatus = async (req: Request, res: Response) => {
	const { status, maxResults } = req.query
	const { service } = req.params
	try {
		const mangaService = serviceFactory(service as string)
		const mangas = await mangaService.getMangasByStatus(
			status as string,
			maxResults ? parseInt(maxResults as string) : undefined
		)
		res.json(mangas)
	} catch (error: any) {
		res.status(500).send("Error fetching mangas by status: " + error.message)
	}
}

export const getSimilarMangas = async (req: Request, res: Response) => {
	const { mangaId, maxResults } = req.query
	const { service } = req.params
	try {
		const mangaService = serviceFactory(service as string)
		const mangas = await mangaService.getSimilarMangas(
			mangaId as string,
			maxResults ? parseInt(maxResults as string) : undefined
		)
		res.json(mangas)
	} catch (error: any) {
		res.status(500).send("Error fetching similar mangas: " + error.message)
	}
}

export const getLatestMangas = async (req: Request, res: Response) => {
	const { maxResults } = req.query
	const { service } = req.params
	try {
		const mangaService = serviceFactory(service as string)
		console.time("getLatestMangas")
		const mangas = await mangaService.getLatestMangas(
			maxResults ? parseInt(maxResults as string) : undefined
		)
		console.timeEnd("getLatestMangas")
		res.json(mangas)
	} catch (error: any) {
		res.status(500).send("Error fetching latest mangas: " + error.message)
	}
}

export const getMangaInfo = async (req: Request, res: Response) => {
	const { link } = req.query

	try {
		const url = new URL(link as string)
		const domain = url.hostname
		const serviceName = getServiceNameFromDomain(domain)

		const mangaService = serviceFactory(serviceName!)
		const manga = await mangaService.getMangaInfo(link as string)
		res.json(manga)
	} catch (error: any) {
		res.status(500).send("Error fetching manga info: " + error.message)
	}
}

export const getMangaChapterImages = async (req: Request, res: Response) => {
	const { chapterId } = req.query
	const { service } = req.params
	try {
		const mangaService = serviceFactory(service as string)
		const images = await mangaService.getMangaChapterImages(chapterId as string)
		res.json(images)
	} catch (error: any) {
		res
			.status(500)
			.send("Error fetching manga chapter images: " + error.message)
	}
}

export const searchMangas = async (req: Request, res: Response) => {
	throw new Error("Method not implemented.")
	// const { service } = req.params
	// try {
	//     const mangaService = serviceFactory(service as string)
	//     const mangas = await mangaService.searchMangas(
	//         req.query,
	//     )
	//     res.json(mangas)
	// } catch (error: any) {
	//     res.status(500).send("Error searching mangas: " + error.message)
	// }
}
