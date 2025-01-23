// @ts-nocheck
import { HfInference } from "@huggingface/inference";

const corsHeaders = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-type"
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		if (request.method === "OPTIONS") {
			return new Response("OK", { headers: corsHeaders });
		}

		if (request.method !== "POST") {
			return new Response(JSON.stringify({ error: `${request.method} method is not allowed` }), { status: 405, headers: corsHeaders })
		}

		try {
			const { input, language } = await request.json();

			const hf = new HfInference(env.HF_TOKEN);

			const result = await hf.translation({
				model: "facebook/mbart-large-50-many-to-many-mmt",
				inputs: input,
				parameters: {
					src_lang: "en_XX",
					tgt_lang: language,
					max_new_tokens: 150,
				},
			});
			// console.log(JSON.stringify(result));
			const translation_text = result.translation_text;
			// console.log(translation_text);
			return new Response(JSON.stringify({ translated_text: translation_text }), { headers: corsHeaders });
		} catch (error) {
			return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
		}
	},
} satisfies ExportedHandler<Env>;
