import {useMemo} from 'react';
import {AbsoluteFill, Sequence, Video, staticFile} from 'remotion';
import {z} from 'zod';
import Avatar from '../components/avatar';
import Caption from '../components/caption';
import NarratedAvatar from '../components/narrator-avatar';
import {Script} from '../metadata';

export type Props = z.infer<typeof Props>;
export const Props = z.object({
	script: Script,
});

export const PresidentComposition: React.FC<Props> = ({script}) => {
	const lines = useMemo(() => {
		let duration = 0;
		return script.map((line, i) => {
			const time = duration;
			duration += line.time;

			if (line.kind === 'narrator') {
				const prev = script.at(i - 1);
				const next = script.at(i + 1);
				const showing =
					prev?.kind === 'spoken'
						? {name: prev.name, emotion: prev.emotion}
						: next?.kind === 'spoken'
						? {name: next.name, emotion: next.emotion}
						: {name: 'Joe Biden', emotion: 'calm'};

				return {
					...line,
					showing,
					from: time,
				};
			}

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
			{lines.map((line, i) => {
				if (line.kind === 'narrator') {
					return (
						<Sequence
							key={`face-${i}`}
							from={line.from * 30}
							durationInFrames={line.time * 30}
						>
							<NarratedAvatar
								name={line.showing.name}
								emotion={line.showing.emotion}
							/>
						</Sequence>
					);
				}
				return (
					<Sequence
						key={`face-${i}`}
						from={line.from * 30}
						durationInFrames={line.time * 30}
					>
						<Avatar name={line.name} emotion={line.emotion} />
					</Sequence>
				);
			})}
			{lastLine ? (
				lastLine.kind === 'narrator' ? (
					<Sequence from={lastLine.from * 30 + lastLine.time * 30}>
						<NarratedAvatar
							name={lastLine.showing.name}
							emotion={lastLine.showing.emotion}
						/>
					</Sequence>
				) : (
					<Sequence from={lastLine.from * 30 + lastLine.time * 30}>
						<Avatar name={lastLine.name} emotion={lastLine.emotion} />
					</Sequence>
				)
			) : null}
			{lines.map((line, i) => (
				<Sequence
					key={`line-${i}`}
					from={line.from * 30}
					durationInFrames={line.time * 30}
				>
					<Caption
						text={line.kind === 'narrator' ? line.text : line.content}
						durationInFrames={line.time * 30}
					/>
				</Sequence>
			))}
		</AbsoluteFill>
	);
};
