import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

const bedrock = createAmazonBedrock({
	region: "us-east-1",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const modelIds = {
	claude: "anthropic.claude-3-5-sonnet-20240620-v1:0",
} as const;

export const claudSonnet = bedrock(modelIds.claude);
