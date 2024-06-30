import * as cheerio from "cheerio";
export async function fetchHTMl(url: string) {
	try {
		const response = await fetch(url);
		return response.text();
	} catch (error) {
		console.error("Error fetching HTML:", error);
		return null;
	}
}
export function cleanHtml(html: string) {
	const document = cheerio.load(html);
	const tagsToRemove = [
		"script",
		"img",
		"svg",
		"noscript",
		"style",
		"link",
		"iframe",
		"video",
		"audio",
		"canvas",
		"map",
		"object",
		"embed",
		"param",
		"picture",
		"source",
		"track",
		"area",
		"base",
		"meta",
		"title",
	];
	for (const tag of tagsToRemove) {
		document(tag).remove();
	}
	return document.html() || "";
}

export async function GET(req: Request) {
	const url = new URL(req.url).searchParams.get("url");

	if (!url) {
		return new Response("No URL provided", { status: 400 });
	}

	const html = await fetchHTMl(url);

	if (!html) {
		return new Response("Failed to fetch HTML", { status: 500 });
	}

	const cleanedHtml = cleanHtml(html);
	return new Response(cleanedHtml, { status: 200 });
}
