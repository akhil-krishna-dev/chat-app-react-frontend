import { memo, useMemo } from "react";
import "./Message.css";
import { SlOptionsVertical } from "react-icons/sl";
import { BaseUrl } from "App";
import ImageMessage from "./ImageMessage";
import { IoMdDownload } from "react-icons/io";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import AudioPlayer from "./AudioPlayer";
import { CustomFileIcon } from "components";
import { useSelector } from "react-redux";
import convertTimestampToDate from "utils/dateUtils";

const Messages = memo(
	({ message, dateTitle }) => {
		const { otherUser } = useSelector(
			(state) => state.chatList.currentChat
		);
		const { authUser } = useSelector((state) => state.users);

		const {
			content,
			file,
			image,
			file_details,
			audio,
			sender,
			status,
			timestamp,
		} = message;

		const isAuthUserMessage = authUser?.id === sender?.id;

		const formattedTime = useMemo(
			() => convertTimestampToDate(timestamp),
			[timestamp]
		);

		const formattedFileSize = useMemo(() => {
			if (!file_details?.file_size) return null;
			const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
			const bytes = file_details.file_size;
			if (bytes === 0) return "0 Bytes";
			const i = Math.floor(Math.log(bytes) / Math.log(1024));
			return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${
				sizes[i]
			}`;
		}, [file_details]);

		const fileExtension = useMemo(() => {
			if (file_details) {
				const ext = file_details.file_name.split(".");
				return ext[ext.length - 1];
			}
			return null;
		}, [file_details]);

		const renderMessageStatus = useMemo(() => {
			let color = "grey";
			if (status === "seen") {
				color = "blue";
			}
			return <IoCheckmarkDoneSharp color={color} />;
		}, [status]);

		const renderMessageBoxClassName = () => {
			return `each-messages-container ${
				isAuthUserMessage ? "current-user " : ""
			}`;
		};

		const renderImageContainerClassName = () => {
			return `user-image-container ${
				isAuthUserMessage ? "current-user " : ""
			}`;
		};

		const renderImage = () => {
			return isAuthUserMessage
				? `${BaseUrl.replace("/api/", "")}${authUser?.image}`
				: `${otherUser?.image}`;
		};

		const renderUserStatusContainerClassName = () => {
			return `message-status ${isAuthUserMessage ? "current-user " : ""}`;
		};

		const renderMessageTimeStamp = () => {
			const titleTimestamp = formattedTime;
			if (titleTimestamp) {
				return `${titleTimestamp.split("at")[1]}`;
			}
		};

		const renderDateTitleBoxTimestamp = () => {
			const titleTimestamp = formattedTime;
			if (titleTimestamp) {
				return titleTimestamp.split("at")[0];
			}
		};

		//
		//
		// rendering message component  ---->>>>
		const renderMessage = () => {
			// rendering first message "you are now connected with"
			if (status === "chat created") {
				return (
					<div className="chat-connected-message-contaner">
						<span>
							{content + otherUser.full_name} <br />
							<center>{formattedTime}</center>
						</span>
					</div>
				);
			}
			// rendering all messages
			return (
				<>
					{dateTitle && (
						<div className="message-date-title-box">
							<span>{renderDateTitleBoxTimestamp()}</span>
						</div>
					)}
					<div className="message-box">
						<div className={renderMessageBoxClassName()}>
							{image && <ImageMessage image={image} />}

							{file_details && (
								<div className="file-container">
									<CustomFileIcon
										fileType={fileExtension}
										color="red"
										size={25}
									/>
									{file_details?.file_name}
									<span
										style={{
											marginLeft: "15px",
											marginRight: "15px",
										}}
									>
										{formattedFileSize}
									</span>
									<a
										href={file}
										download={file}
										target="_blank"
									>
										<IoMdDownload color="grey" size={25} />
									</a>
								</div>
							)}

							{audio && <AudioPlayer audioUrl={audio} />}
							{content && <p>{content}</p>}
						</div>
						<div className={renderImageContainerClassName()}>
							<img src={renderImage()} alt="User" />
						</div>
						<div className={renderUserStatusContainerClassName()}>
							{isAuthUserMessage && (
								<span>{renderMessageStatus}</span>
							)}
							<span>{renderMessageTimeStamp()}</span>
							<span>
								<SlOptionsVertical color="grey" />
							</span>
						</div>
					</div>
				</>
			);
		};

		// ---->>>>
		return renderMessage();
	},
	(prevProps, nextProps) => {
		return prevProps.message.status === nextProps.message.status;
	}
);

export default Messages;
