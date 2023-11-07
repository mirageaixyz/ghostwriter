import {z} from 'zod';

export type Line = z.infer<typeof Line>;
export const Line = z.discriminatedUnion('kind', [
	z.object({
		kind: z.literal('narrator'),
		text: z.string(),
	}),
	z.object({
		kind: z.literal('spoken'),
		name: z.string(),
		content: z.string(),
		emotion: z.enum(['calm', 'angry', 'laugh', 'sad', 'happy', 'surprised']),
	}),
]);
export type PostLine = z.infer<typeof PostLine>;
export const PostLine = Line.and(
	z.object({
		time: z.number(),
		face: z.number().optional(),
	})
);
export type Script = z.infer<typeof Script>;
export const Script = z.array(PostLine);
