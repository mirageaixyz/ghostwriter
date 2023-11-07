import {PostLine} from '@ghostwriter/actor';
import {z} from 'zod';

export type Script = z.infer<typeof Script>;
export const Script = z.array(PostLine);

export type Metadata = z.infer<typeof Metadata>;
export const Metadata = z.object({
	kind: z.string(),
	date: z.string(),
	script: Script,
	output: z.object({audio: z.string(), video: z.string()}),
});
