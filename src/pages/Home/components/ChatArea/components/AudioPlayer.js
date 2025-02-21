import React, {useEffect, useState, useRef} from 'react'
import WaveSurfer from "wavesurfer.js";
import './AudioPlayer.css'
import { FaPlay , FaPause} from "react-icons/fa6";



const AudioPlayer = ({audioUrl}) => {
    const waveformRef = useRef(null)
    const wavesurferRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const deviceWidth = window.innerWidth

    useEffect(() => {
        if (!wavesurferRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: 'rgb(175 175 191)',
                progressColor: 'white',
                cursorColor: 'transparent',
                barWidth: 2,
                width:deviceWidth<769?150:300,
                height: deviceWidth<769?45:60,
                responsive: true,
                backend: 'WebAudio',
            });

            if(audioUrl){
                wavesurferRef.current.load(audioUrl);
            }

            wavesurferRef.current.on('ready', () => {
            });

            wavesurferRef.current.on('finish', () => {
                setIsPlaying(false);
            });
            
        }
    },[audioUrl])

    const playVoiceMsg = () => {
        setIsPlaying(!isPlaying);
        wavesurferRef.current.playPause();
    }

    const renderAudioDuration = () => {
        const voiceDuration = wavesurferRef.current.getDuration()
        if(wavesurferRef.current){
            const seconds = Math.round(voiceDuration)
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        return null
    }


    return (
        <div ref={waveformRef}  id="waveform">
            <div className='play-pause-container' >
                {
                    isPlaying?
                    <FaPause onClick={playVoiceMsg} size={deviceWidth<769?25:35} />
                    :<FaPlay onClick={playVoiceMsg} size={deviceWidth<769?25:35} />
                }
            </div> 
            {
               wavesurferRef.current&& 
               <div className='duration-container'>
                {renderAudioDuration()}
               </div>
            }         
        </div>
    )

}

export default AudioPlayer