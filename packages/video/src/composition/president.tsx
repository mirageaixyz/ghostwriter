import {useMemo} from 'react';
import {AbsoluteFill, Sequence, Video, staticFile} from 'remotion';
import {z} from 'zod';
import Avatar from '../components/avatar';
import Caption from '../components/caption';
import {Script} from '../metadata';

export type Props = z.infer<typeof Props>;
export const Props = z.object({
	script: Script,
});

export const PresidentComposition: React.FC<Props> = ({script}) => {
	const lines = useMemo(() => {
		let duration = 0;
		return script.map((line) => {
			const time = duration;
			duration += line.time;

			return {
				...line,
				from: time,
			};
		});
	}, [script]);

	const lastLine = useMemo(() => {
		return lines.at(-1);
	}, [lines]);

	return (
		<AbsoluteFill className="bg-gray-100 items-center justify-center">
			<Video
				style={{
					position: 'absolute',
					bottom: 0,
					transform: 'translateY(-37.5%) scale(1.75)',
					zIndex: 20,
				}}
				src={staticFile('/out/output.mp4')}
			/>
			{lines.map((line, i) => (
				<Sequence
					key={`face-${i}`}
					from={line.from * 30}
					durationInFrames={line.time * 30}
				>
					<Avatar name={line.name} face={line.face} />
				</Sequence>
			))}
			{lastLine ? (
				<Sequence from={lastLine.from * 30 + lastLine.time * 30}>
					<Avatar name={lastLine.name} face={lastLine.face} />
				</Sequence>
			) : null}
			{lines.map((line, i) => (
				<Sequence
					key={`line-${i}`}
					from={line.from * 30}
					durationInFrames={line.time * 30}
				>
					<Caption text={line.content} durationInFrames={line.time * 30} />
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
