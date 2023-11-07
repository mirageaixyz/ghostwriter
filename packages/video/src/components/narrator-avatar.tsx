import React, {useMemo} from 'react';
import {Img, staticFile} from 'remotion';
import {z} from 'zod';

export type Props = z.infer<typeof Props>;
export const Props = z.object({
	name: z.string(),
	emotion: z.string(),
});

const NarratedAvatar: React.FC<Props> = ({name, emotion}) => {
	const persona = useMemo(() => {
		if (!name.includes(' ')) return name;
		return name.includes('Biden')
			? 'biden'
			: name.includes('Trump')
			? 'trump'
			: 'obama';
	}, [name]);

	return (
		<Img
			className="w-full absolute top-0 z-10 -translate-y-[10%] grayscale"
			src={staticFile(`${persona}/${emotion}.png`)}
		/>
	);
};

export default NarratedAvatar;
