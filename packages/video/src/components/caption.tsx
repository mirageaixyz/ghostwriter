import React, {useMemo} from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {z} from 'zod';

export type Props = z.infer<typeof Props>;
export const Props = z.object({
	text: z.string(),
	durationInFrames: z.number(),
});

const Caption: React.FC<Props> = ({text, durationInFrames}) => {
	const frame = useCurrentFrame();
	const words = useMemo(() => text.split(' '), [text]);

	const lines = useMemo(() => {
		const lines: string[] = [];
		// Make sure we have at most 5 words per line
		for (let i = 0; i < words.length; i += 5) {
			lines.push(words.slice(i, i + 5).join(' '));
		}
		return lines;
	}, [words]);

	const index = interpolate(
		frame,
		[0, durationInFrames],
		[0, lines.length - 1]
	);

	const line = useMemo(() => lines[Math.round(index)], [index, lines]);

	return (
		<div className="absolute bottom-16 z-30 flex w-full items-center justify-center bg-black/50">
			<span
				className={`px-4 text-6xl text-white font-bold leading-relaxed text-center [text-wrap:balance]`}
			>
				{line}
			</span>
		</div>
	);
};

export default Caption;
