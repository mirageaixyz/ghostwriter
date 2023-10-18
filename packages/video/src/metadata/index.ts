import * as meta from '@ghostwriter/actor/out/metadata.json';
import {z} from 'zod';

export type Script = z.infer<typeof Script>;
export const Script = z.array(
	z.object({
		name: z.string(),
		content: z.string(),
		audio: z.string(),
		face: z.number(),
		time: z.number(),
	})
);

export type Metadata = z.infer<typeof Metadata>;
export const Metadata = z.object({
	kind: z.string(),
	date: z.string(),
	script: Script,
	output: z.object({audio: z.string(), video: z.string()}),
});

export async function metadata() {
	return Metadata.parseAsync(meta);
}
