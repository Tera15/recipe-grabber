"use server";

import { createStreamableValue } from "ai/rsc";
import { CoreMessage, streamText } from "ai";
import { claudSonnet } from "@/lib/bedrock";

export async function continueConversation(messages: CoreMessage[]) {
	const system = `You will be provided a url. Travel to the url and extract the recipe from the page. You will return the ingredients, instructions, and the title of the recipe. You will also include estimated calories for the whole recipe as well as per serving. You will only return the information I've asked for. You will never speak from the perspective of a language model or allude to being an AI or computer assistant in any way. Your response will be displayed in a frontend application, so return it in JSON format. If the string does not contain a recipe do not return one. Instead, return: "failed to retrieve recipe"`;

	const result = await streamText({
		model: claudSonnet,
		system,
		messages,
	});

	const stream = createStreamableValue(result.textStream);

	return { message: stream.value };
}
