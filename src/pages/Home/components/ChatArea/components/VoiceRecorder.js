import React, { useRef } from "react";
import { MdOutlineKeyboardVoice, MdPauseCircle } from "react-icons/md";

const VoiceRecorder = ({
	recording,
	onRecorded,
	handleAudioRecording,
	mediaRecorderRef,
}) => {
	const streamRef = useRef(null);

	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			handleAudioRecording("start");

			streamRef.current = stream;

			mediaRecorderRef.current = new MediaRecorder(stream);
			mediaRecorderRef.current.ondataavailable = (event) => {
				handleAudioRecording("stop");
				const audioBlob = event.data;
				onRecorded(audioBlob); // send the audio blob when recording stops
			};

			mediaRecorderRef.current.onstop = () => {
				streamRef.current
					?.getAudioTracks()
					.forEach((track) => track.stop());

				streamRef.current = null;
			};

			mediaRecorderRef.current.start();
		} catch (error) {
			console.log(error);
			handleAudioRecording("stop");
		}
	};

	const stopRecording = () => {
		if (
			mediaRecorderRef.current &&
			mediaRecorderRef.current.state === "recording"
		) {
			mediaRecorderRef.current.stop();
		}
	};

	return (
		<>
			{recording ? (
				<MdPauseCircle
					style={{ cursor: "pointer" }}
					onClick={stopRecording}
					size={35}
				/>
			) : (
				<MdOutlineKeyboardVoice
					style={{ cursor: "pointer" }}
					onClick={startRecording}
					size={35}
				/>
			)}
		</>
	);
};

export default VoiceRecorder;
