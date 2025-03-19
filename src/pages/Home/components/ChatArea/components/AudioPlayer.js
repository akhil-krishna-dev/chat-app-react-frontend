import React, { useEffect, useState, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import "./AudioPlayer.css";
import { FaPlay, FaPause } from "react-icons/fa6";

const AudioPlayer = ({ audioUrl }) => {
	const waveformRef = useRef(null);
	const [waveSurfer, setWaveSurfer] = useState(null);
	const [isPlaying, setIsPlaying] = useState(false);
	const deviceWidth = window.innerWidth;

	useEffect(() => {
		if (!waveSurfer) {
			const waveSurferObject = WaveSurfer.create({
				container: waveformRef.current,
				waveColor: "rgb(175 175 191)",
				progressColor: "white",
				cursorColor: "transparent",
				barWidth: 2,
				width: deviceWidth < 769 ? 150 : 300,
				height: deviceWidth < 769 ? 45 : 60,
				responsive: true,
				backend: "WebAudio",
			});

			if (audioUrl) {
				waveSurferObject.load(audioUrl);
			}

			waveSurferObject.on("ready", () => {
				setWaveSurfer(waveSurferObject);
			});

			waveSurferObject.on("finish", () => {
				setIsPlaying(false);
			});
		}

		return () => {
			if (waveSurfer) {
				waveSurfer.destroy();
				setWaveSurfer(null);
			}
		};
	}, [audioUrl, waveSurfer]);

	const playVoiceMsg = () => {
		setIsPlaying(!isPlaying);
		waveSurfer.playPause();
	};

	const renderAudioDuration = () => {
		if (!waveSurfer) return "0:00";
		const voiceDuration = waveSurfer.getDuration();
		if (voiceDuration) {
			const seconds = Math.round(voiceDuration);
			const mins = Math.floor(seconds / 60);
			const secs = seconds % 60;
			return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
		}
		return null;
	};

	return (
		<div ref={waveformRef} id="waveform">
			<div className="play-pause-container">
				{isPlaying ? (
					<FaPause
						onClick={playVoiceMsg}
						size={deviceWidth < 769 ? 25 : 35}
					/>
				) : (
					<FaPlay
						onClick={playVoiceMsg}
						size={deviceWidth < 769 ? 25 : 35}
					/>
				)}
			</div>
			{waveSurfer && (
				<div className="duration-container">
					{renderAudioDuration()}
				</div>
			)}
		</div>
	);
};

export default AudioPlayer;
