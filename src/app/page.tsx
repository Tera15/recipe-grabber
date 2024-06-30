"use client";

import { type CoreMessage } from "ai";
import { useChat } from "ai/react";
import { useEffect, useState } from "react";
import { continueConversation } from "./actions";
import { readStreamableValue } from "ai/rsc";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Home() {
	// const { messages, input, handleInputChange, handleSubmit } = useChat();
	const [messages, setMessages] = useState<CoreMessage[]>([]);
	const [input, setInput] = useState("");
	const [data, setData] = useState<any>();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const newMessages: CoreMessage[] = [
			...messages,
			{ role: "user", content: input },
		];
		setMessages(newMessages);
		setInput("");

		const result = await continueConversation(newMessages);
		setData(result.data);
		for await (const content of readStreamableValue(result.message)) {
			setMessages([
				...newMessages,
				{ role: "assistant", content: content as string },
			]);
		}
	};
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInput(e.target.value);
	};
	return (
		<div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
			{data && <pre>{JSON.stringify(data, null, 2)}</pre>}
			{messages.map((m, i) => (
				<div
					key={i}
					className="whitespace-pre-wrap"
				>
					{m.role === "user" ? "User: " : "AI: "}
					{m.content as string}
				</div>
			))}

			<form onSubmit={handleSubmit}>
				<input
					className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
					value={input}
					placeholder="Say something..."
					onChange={handleInputChange}
				/>
			</form>
		</div>
	);
}
