// @ts-nocheck
import { HfInferenceEndpoint } from "@huggingface/inference";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type"
};

const models = {
	'es': 'Helsinki-NLP/opus-mt-en-es',
	'fr': 'Helsinki-NLP/opus-mt-en-fr',
	'ja_XX': 'facebook/mbart-large-50-many-to-many-mmt'
};

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response("OK", { headers: corsHeaders });
		}

		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: `${request.method} method is not allowed` }), { status: 405, headers: corsHeaders });
		}

		try {
			const { input, language } = await request.json();

			if (!input || input.trim().length === 0) {
				return new Response(JSON.stringify({ error: "Input text is required" }), { status: 400, headers: corsHeaders });
			}

			if (!language || !models[language]) {
				return new Response(JSON.stringify({ error: "Invalid or unsupported language" }), { status: 400, headers: corsHeaders });
			}

			const url = `https://gateway.ai.cloudflare.com/v1/0b6a5ba88d1fccaad9cc5deb10b96dac/hf_translation_gateway/huggingface/${models[language]}`;
			const hfe = new HfInferenceEndpoint(url, env.HF_TOKEN);

			let result;
			if (language === 'ja_XX') {
				result = await hfe.translation({
					inputs: input,
					parameters: {
						src_lang: "en_XX",
						tgt_lang: language,
						max_new_tokens: 150,
					},
				});
			} else {
				result = await hfe.translation({ inputs: input });
			}

			console.log(JSON.stringify(result));
			const translation_text = result.translation_text;
			return new Response(JSON.stringify({ translation_text }), { headers: corsHeaders });
		} catch (error) {
			console.error("Translation error:", error);
			return new Response(JSON.stringify({ error: "An error occurred during translation" }), { status: 500, headers: corsHeaders });
		}
	},
} satisfies ExportedHandler<Env>;
