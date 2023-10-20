import {getVideoMetadata} from '@remotion/media-utils';
import {useEffect, useState} from 'react';
import {Composition, continueRender, delayRender, staticFile} from 'remotion';
import {
	PresidentComposition,
	Props as PresidentProps,
} from './composition/president';
import {Script} from './metadata';
import './style.css';

export const RemotionRoot: React.FC = () => {
	const [handle] = useState(() => delayRender());
	const [duration, setDuration] = useState(1);
	const [script] = useState<Script>([]);

	useEffect(() => {
		async function fetchMetadata() {
			const {durationInSeconds} = await getVideoMetadata(
				staticFile('/out/output.mp4')
			);

			setDuration(Math.round(durationInSeconds * 30));
		}

		fetchMetadata()
			.then(() => {
				continueRender(handle);
			})
			.catch((err) => {
				console.log(`Error fetching metadata: ${err}`);
			});
	}, [handle]);

	return (
		<>
			<Composition
				id="presidents"
				component={PresidentComposition}
				durationInFrames={duration}
				fps={30}
				width={1080}
				height={1920}
				schema={PresidentProps}
				defaultProps={{
					script,
				}}
			/>
		</>
	);
};
