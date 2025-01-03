// This file is for demonstration purposes only and is not used in the project. Because when trying to import this file it cause "Import declaration conflicts with local declaration of 'MixinBase'.ts(2440) due to how it is setup"

/**
 * MixinBase is an empty abstract class that serves as a base for applying multiple mixins.
 *
 * The purpose of this class is to provide a common base that can be extended by other classes
 * to inherit methods from multiple mixins. By using this approach, we can combine functionalities
 * from different mixins into a single class, making it easier to manage and maintain the code.
 *
 * This class is particularly useful when we need to extend or implement multiple mixins in a
 * TypeScript class, as it allows us to ensure that the base class is aware of all the methods
 * provided by the mixins. This approach helps to avoid method conflicts and provides a structured
 * way to handle default method implementations.
 *
 * Sample Usage:
 *
 * // Define mixins
 * class RotateUserAgentMixin {
 *     protected getRequestHeaders(): Record<string, string> {
 *         const userAgents = [
 *             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3",
 *             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
 *             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
 *             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
 *             "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
 *         ];
 *         const randomUserAgent = userAgents[Math.floor(Math.random() * userAgents.length)];
 *         return { "User-Agent": randomUserAgent };
 *     }
 * }
 *
 * class LoggingMixin {
 *     protected getRequestHeaders(): Record<string, string> {
 *         console.log("Logging headers");
 *         return { "X-Logging": "true" };
 *     }
 * }
 *
 * // Apply mixins to MixinBase
 * interface MixinBase extends RotateUserAgentMixin, LoggingMixin {}
 * applyMixins(MixinBase, [RotateUserAgentMixin, LoggingMixin]);
 *
 * // Extend MixinBase in the base class
 * class BaseMangaService extends MixinBase {
 *     protected baseUrl: string;
 *
 *     constructor(baseUrl: string) {
 *         super();
 *         this.baseUrl = baseUrl;
 *     }
 *
 *     protected getRequestHeaders(): Record<string, string> {
 *         const rotateUserAgentHeaders = this.getRotateUserAgentHeaders();
 *         const loggingHeaders = this.getLoggingHeaders();
 *         return { ...rotateUserAgentHeaders, ...loggingHeaders, Referer: this.baseUrl };
 *     }
 * }
 */
abstract class MixinBase {}

export default MixinBase
