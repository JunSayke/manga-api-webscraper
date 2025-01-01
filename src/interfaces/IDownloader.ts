interface IDownloader {
	download(urls: string[]): Promise<any>
}

export default IDownloader
