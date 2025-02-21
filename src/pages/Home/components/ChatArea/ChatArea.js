import React, { useEffect, useRef, useState } from "react";
import "./ChatArea.css";
import UserProfile from "./components/UserProfile";
import Message from "./components/Message";
import MessageInput from "./components/MessageInput";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BaseUrl, WebSocketUrl } from "App";
import { checkJWT } from "utils/tokenUtils";
import { MdCancel } from "react-icons/md";
import { CustomFileIcon, Loader } from "components";
import { FaAnglesDown } from "react-icons/fa6";
import Picker from "@emoji-mart/react";
import { GiSoundWaves } from "react-icons/gi";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { FaRegCircleXmark } from "react-icons/fa6";
import FileUploadLoader from "components/FileUploadLoader/FileUploadLoader";
import {
	updateCurrentChat,
	updateMessagesInChat,
	clearSeenMessageCount,
	updateSeenMessage,
	updateCurrentChatMessagesWithNextPage,
} from "store/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import { makeMessgesAsSeen } from "utils/messageUtils";

const ChatArea = () => {
	const { messages } = useSelector((state) => state.chatList.currentChat);
	const { chatList } = useSelector((state) => state.chatList);
	const { authUser } = useSelector((state) => state.users);
	const { isSmallDevice } = useSelector(
		(state) => state.chatList.smallDevice
	);

	const dispatch = useDispatch();

	const [firstLoad, setFirstLoad] = useState(true);
	const [messagesLoader, setMessagesLoader] = useState(false);
	const [chatEndRefShow, setChatEndRefShow] = useState(true);
	const [userIsScrollingToTop, setUserIsScrollingToTop] = useState(false);

	const chatEndRef = useRef(null);
	const chatStartRef = useRef(null);
	const newMessageRef = useRef(null);

	const { chatId } = useParams();
	const [socket, setSocket] = useState(null);
	const [isWebSocketOpen, setIsWebSocketOpen] = useState(false);
	const [message, setMessage] = useState("");

	const [selectedFile, setSelectedFile] = useState([]);
	const [selectedImage, setSelectedImage] = useState([]);
	const [previewImage, setPreviewImage] = useState([]);
	const fileRef = useRef();
	const imageRef = useRef();

	const [showEmojyPicker, setShowEmojyPicker] = useState(false);

	const [recordingTime, setRecordingTime] = useState(0);
	const recordingRef = useRef(null);
	const [audioRecording, setAudioRecording] = useState(false);
	const [audioBlob, setAudioBlob] = useState(null);
	const [audioURL, setAudioURL] = useState("");
	const [isSendingVoice, setIsSendingVoice] = useState(false);

	const [selectingFile, setSelectingFile] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);

	const acceptedDocumentTypes =
		".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt, .rtf, .csv, .zip, .rar, .7z, .html, .xml, .json, .js, .css, .ts, .jsx, .tsx, .py, .java, .c, .cpp, .cs, .php, .sql, .rb, .swift, .go, .rs, .dart, .pl, .sh";

	const addEmojy = (emojy) => {
		setMessage(message + emojy.native);
	};

	useEffect(() => {
		if (chatList.length === 0) return;

		setTimeout(() => {
			if (chatId) {
				dispatch(
					updateCurrentChat({ chatId, authUserId: authUser.id })
				);
			}
		}, 300);

		setTimeout(() => {
			setFirstLoad(false);
		}, 1500);

		if (messages.results.length > 0) {
			setChatEndRefShow(true);
		}

		const handleSeenMessagesTime = setTimeout(() => {
			handleMakeMessagesAsSeen();
		}, 2000);

		if (chatEndRef.current && !userIsScrollingToTop) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}

		return () => {
			clearTimeout(handleSeenMessagesTime);
		};
	}, [chatList, messages, authUser, chatId]);

	useEffect(() => {
		const newSocket = new WebSocket(
			`${WebSocketUrl}chat/${chatId}/?token=${checkJWT()}`
		);

		if (authUser) {
			newSocket.onopen = () => {
				setIsWebSocketOpen(true);
			};
		}

		newSocket.onmessage = (event) => {
			const data = JSON.parse(event.data);

			switch (data.type) {
				case "seen_message_ids":
					const payload = {
						chatId: data.data.chat_id,
						msgIds: data.data.message_ids,
					};
					dispatch(updateSeenMessage(payload));
					break;
			}
		};

		newSocket.onclose = () => {
			setIsWebSocketOpen(false);
		};

		newSocket.onerror = (error) => {
			setIsWebSocketOpen(false);
		};

		setSocket(newSocket);

		return () => {
			if (newSocket.readyState === WebSocket.OPEN) {
				newSocket.close();
				setIsWebSocketOpen(false);
			}
		};
	}, [chatId, authUser]);

	useEffect(() => {
		const scrollContainer = chatStartRef.current;
		scrollContainer.addEventListener("scroll", handleScrollTop);

		if (chatEndRef.current && !userIsScrollingToTop) {
			chatEndRef.current.scrollIntoView({ behavior: "smooth" });
		}

		return () => {
			scrollContainer.removeEventListener("scroll", handleScrollTop);
			setChatEndRefShow(true);
		};
	}, [chatId, messages]);

	useEffect(() => {
		setUserIsScrollingToTop(false);
	}, [chatId]);

	useEffect(() => {
		if (audioRecording) {
			recordingRef.current = setInterval(() => {
				setRecordingTime((prev) => prev + 1);
			}, 1000);
		}
		if (!audioRecording) {
			clearInterval(recordingRef.current);
			setRecordingTime(0);
		}
	}, [audioRecording]);

	// <<<<----->>>>
	const handleMakeMessagesAsSeen = () => {
		if (messages?.results?.length > 0 && isWebSocketOpen) {
			const data = {
				chatId: parseInt(chatId),
				messagesResults: messages?.results,
				authUser,
			};
			makeMessgesAsSeen(data);
		}
	};

	const handleScrollTop = async () => {
		if (chatStartRef.current.scrollTop === 0 && !messagesLoader) {
			setUserIsScrollingToTop(true);
			setMessagesLoader(true);
			await fetchNextPage();
		}

		if (
			chatStartRef.current.scrollTop +
				chatStartRef.current.clientHeight >=
			chatStartRef.current.scrollHeight
		) {
			setUserIsScrollingToTop(false);
			dispatch(clearSeenMessageCount(chatId));
		}
	};

	const showMoreMessages = () => {
		if (!messagesLoader) {
			setMessagesLoader(true);
			fetchNextPage();
		}
	};

	const scrollToBottomMessages = () => {
		newMessageRef.current.scrollIntoView({ behavior: "smooth" });
	};

	const fetchNextPage = async () => {
		let nextPage = await messages?.next;
		if (!nextPage) {
			setTimeout(() => {
				setMessagesLoader(false);
			}, 500);
			return;
		}
		let pageUrl = "";
		if (nextPage) {
			const urlArr = nextPage.split("=");
			pageUrl = `${BaseUrl}home/chats/${chatId}/?page=${urlArr[1]}`;
		}
		axios
			.get(pageUrl)
			.then((response) => {
				const data = response.data;
				setTimeout(() => {
					setMessagesLoader(false);
					dispatch(updateCurrentChatMessagesWithNextPage(data));
				}, 500);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const selectFile = () => {
		fileRef.current.click();
	};

	const selectImage = () => {
		imageRef.current.click();
	};

	const handleFileChange = (event) => {
		setSelectingFile(true);
		const files = Array.from(event.target.files);
		setSelectedFile(files);
		setSelectingFile(false);
	};

	const handleImageChange = (event) => {
		setSelectingFile(true);
		const files = Array.from(event.target.files);
		setSelectedImage(files);

		const previews = files.map((image) => {
			const reader = new FileReader();
			reader.readAsDataURL(image);
			return new Promise((resolve) => {
				reader.onloadend = () => {
					resolve(reader.result);
				};
			});
		});

		Promise.all(previews)
			.then((images) => {
				setPreviewImage(images);
			})
			.finally(() => {
				setSelectingFile(false);
			});
	};

	const handleSendFile = () => {
		setChatEndRefShow(true);

		setTimeout(() => {
			if (newMessageRef.current) {
				newMessageRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 1000);

		const formData = new FormData();
		selectedFile.forEach((file, index) => {
			formData.append(`files${index}`, file);
		});

		if (selectedFile) {
			axios
				.post(
					`${BaseUrl}home/chats/${chatId}/send_any_file/`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				)
				.then((response) => {
					setSelectedFile([]);
					response.data.forEach((file) => {
						dispatch(updateMessagesInChat(file));
					});
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setMessage("");
				});
		}
	};

	const handleSendImage = () => {
		setChatEndRefShow(true);

		setTimeout(() => {
			if (newMessageRef.current) {
				newMessageRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 1000);

		const formData = new FormData();

		selectedImage.forEach((image, index) => {
			formData.append(`image${index}`, image);
		});

		if (selectedImage) {
			axios
				.post(
					`${BaseUrl}home/chats/${chatId}/send_image_file/`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
						onUploadProgress: (progressEvent) => {
							const progress = Math.round(
								(progressEvent.loaded * 100) /
									progressEvent.total
							);
							setUploadProgress(progress);
						},
					}
				)
				.then((response) => {
					setSelectedImage([]);
					setPreviewImage([]);
					response.data.forEach((message) => {
						dispatch(updateMessagesInChat(message));
					});
					setUploadProgress(0);
				})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setMessage("");
				});
		}
	};

	const handleSendVoice = () => {
		setIsSendingVoice(true);
		setChatEndRefShow(true);

		setTimeout(() => {
			if (newMessageRef.current) {
				newMessageRef.current.scrollIntoView({ behavior: "smooth" });
			}
		}, 1000);
		const formData = new FormData();
		formData.append("audio", audioBlob, "voice.wav");

		axios
			.post(
				`${BaseUrl}home/chats/${chatId}/send_voice_message/`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			)
			.then((response) => {
				setAudioURL("");
				dispatch(updateMessagesInChat(response.data));
				setIsSendingVoice(false);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleSendMessage = () => {
		setShowEmojyPicker(false);

		if (selectedImage.length > 0) {
			handleSendImage();
			return;
		}

		if (selectedFile.length > 0) {
			handleSendFile();
			return;
		}

		if (!message) return;

		if (isWebSocketOpen) {
			setChatEndRefShow(true);

			setTimeout(() => {
				if (newMessageRef.current) {
					newMessageRef.current.scrollIntoView({
						behavior: "smooth",
					});
				}
			}, 1000);

			const messageData = { message };
			socket.send(JSON.stringify(messageData));
			setMessage("");
		} else {
			axios
				.post(`${BaseUrl}home/chats/${chatId}/send_message/`, {
					content: message,
				})
				.then((response) => {})
				.catch((error) => {
					console.log(error);
				})
				.finally(() => {
					setMessage("");
				});
		}
	};

	const cancelSendFile = () => {
		fileRef.current.value = "";
		setSelectedFile([]);
	};

	const cancelSendImage = () => {
		imageRef.current.value = "";
		setSelectedImage([]);
		setPreviewImage([]);
	};

	const renderLoadMoreOrLoader = () => {
		if (!messages?.next) {
			return null;
		}
		if (messagesLoader) {
			return <Loader />;
		}

		return (
			<div
				onClick={showMoreMessages}
				className="old-messages-loading-btn"
			>
				Load more
			</div>
		);
	};

	const renderScrollDownBtn = () => {
		if (userIsScrollingToTop) {
			return (
				<div className="show-new-message-container">
					<div
						onClick={scrollToBottomMessages}
						className="show-new-message-btn-container"
					>
						<FaAnglesDown color="#6464e8" size={20} />
					</div>
				</div>
			);
		}
	};

	const formatRecordTime = (seconds) => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
	};

	const handleCloseVoiceMsg = () => {
		setAudioURL("");
		setAudioRecording(false);
		setAudioBlob(null);
	};

	const renderVoiceMessage = () => {
		if (audioRecording || audioURL) {
			return (
				<div className="audio-message-player-container">
					<FaRegCircleXmark
						onClick={handleCloseVoiceMsg}
						className="clear-recording"
					/>
					{audioRecording ? (
						<div>
							<GiSoundWaves size={30} color="red" />
							<p> {formatRecordTime(recordingTime)} </p>
						</div>
					) : (
						audioURL && (
							<>
								<audio src={audioURL} controls />
								{isSendingVoice ? (
									<Loader />
								) : (
									<IoIosCheckmarkCircleOutline
										onClick={handleSendVoice}
									/>
								)}
							</>
						)
					)}
				</div>
			);
		}
	};

	const splitFileExtension = (fileName) => {
		if (fileName) {
			let ext = fileName.split(".");
			return ext[ext.length - 1];
		}
	};

	return (
		<div className={`chat-area-container ${isSmallDevice && "active"}`}>
			<UserProfile />

			{selectingFile && <FileUploadLoader />}

			<div ref={chatStartRef} className="messages-container">
				<div className="loader-container">
					{renderLoadMoreOrLoader()}
				</div>

				{messages?.results?.length > 0 ? (
					messages?.results?.map((message) => (
						<Message key={message.id} message={message} />
					))
				) : firstLoad ? (
					<div className="first-load-container">
						{" "}
						<Loader />{" "}
					</div>
				) : null}

				{previewImage.length > 0 && (
					<div
						key={"images-preview"}
						className="image-send-preview-container"
					>
						{previewImage.map((image) => (
							<div className="img-container">
								<img src={image} alt="preview" />
							</div>
						))}
						<div className="cancel-btn-container">
							<MdCancel
								onClick={cancelSendImage}
								size={40}
								style={{ cursor: "pointer" }}
								color="white"
							/>
						</div>
					</div>
				)}

				{selectedFile.length > 0 && (
					<div
						key={"files-preview"}
						className="file-send-preview-container"
					>
						<div className="file-container">
							{selectedFile.map((file, index) => (
								<div key={index} className="each-file">
									<CustomFileIcon
										fileType={splitFileExtension(file.name)}
										color="red"
										size={25}
									/>
									{file.name}
								</div>
							))}
						</div>
						<div className="cancel-btn-container">
							<MdCancel
								onClick={cancelSendFile}
								size={40}
								style={{
									marginLeft: "15px",
									cursor: "pointer",
								}}
								color="black"
							/>
						</div>
					</div>
				)}

				{chatEndRefShow && <div ref={chatEndRef}></div>}

				{renderScrollDownBtn()}

				<div ref={newMessageRef}></div>
			</div>

			<div className="emojy-selection-container">
				{showEmojyPicker && <Picker onEmojiSelect={addEmojy} />}
			</div>

			{renderVoiceMessage()}

			<input
				onChange={handleFileChange}
				style={{ display: "none" }}
				ref={fileRef}
				type="file"
				accept={acceptedDocumentTypes}
				multiple
			/>
			<input
				onChange={handleImageChange}
				style={{ display: "none" }}
				ref={imageRef}
				type="file"
				accept="image/*"
				multiple
			/>

			<MessageInput
				selectFile={selectFile}
				selectImage={selectImage}
				handleSendMessage={handleSendMessage}
				showEmojyPicker={showEmojyPicker}
				setShowEmojyPicker={setShowEmojyPicker}
				setMessage={setMessage}
				message={message}
				audioRecording={audioRecording}
				setAudioRecording={setAudioRecording}
				setAudioBlob={setAudioBlob}
				setAudioURL={setAudioURL}
			/>
		</div>
	);
};

export default ChatArea;
