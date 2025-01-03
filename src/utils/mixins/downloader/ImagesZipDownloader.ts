import AdmZip from "adm-zip"
import IDownloader from "../../../interfaces/IDownloader"

class ImagesZipDownloader implements IDownloader {
	public download(urls: string[]): Promise<any> {
		// const zip = new AdmZip()
		// for (const imageUrl of urls) {
		// 	const response = await this.fetch<Buffer>(imageUrl, {
		// 		responseType: "arraybuffer",
		// 	})
		// 	const imageName = imageUrl.split("/").pop() || "image.jpg"
		// 	zip.addFile(imageName, response)
		// }
		// return zip.toBuffer()
		throw new Error("Method not implemented.")
	}
}

export default ImagesZipDownloader
