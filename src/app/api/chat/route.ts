import { claudSonnet } from "@/lib/bedrock";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages } = await req.json();

	const result = await streamText({
		model: claudSonnet,
		messages,
	});

	return result.toAIStreamResponse();
}