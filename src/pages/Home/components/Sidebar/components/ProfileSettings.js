import React, { useRef, useState, useEffect } from "react";
import "./ProfileSettings.css";
import { BaseUrl } from "App";
import Swal from "sweetalert2";
import axios from "axios";
import { GrEdit } from "react-icons/gr";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { BiLoaderAlt } from "react-icons/bi";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import Logout from "./Logout";
import {
	updateUserFullName,
	updateUserProfileImage,
	updateUserStatus,
} from "store/userSlice";
import { useDispatch, useSelector } from "react-redux";

const ProfileSettings = () => {
	const { authUser } = useSelector((state) => state.users);

	const dispatch = useDispatch();

	const inputRef = useRef();
	const [imgChangeLoader, setImgChangeLoader] = useState(false);

	const [selectedImage, setSelectedImage] = useState(null);
	const [croppedImage, setCroppedImage] = useState(null);
	const [crop, setCrop] = useState({
		unit: "px",
		x: 50,
		y: 50,
		width: 150,
		height: 150,
	});
	const [completedCrop, setCompletedCrop] = useState(null);
	const imageRef = useRef(null);

	const onSelectFile = (event) => {
		const file = event.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.addEventListener("load", () =>
				setSelectedImage(reader.result)
			);
			reader.readAsDataURL(file);
		}
	};

	const onImageLoaded = (image) => {
		imageRef.current = image.currentTarget;
	};

	const onCropComplete = (crop) => {
		setCompletedCrop(crop);
	};

	const getCroppedImg = async (image, crop) => {
		const canvas = document.createElement("canvas");
		const scaleX = image.naturalWidth / image.width;
		const scaleY = image.naturalHeight / image.height;
		canvas.width = crop.width;
		canvas.height = crop.height;
		const ctx = canvas.getContext("2d");

		ctx.drawImage(
			image,
			crop.x * scaleX,
			crop.y * scaleY,
			crop.width * scaleX,
			crop.height * scaleY,
			0,
			0,
			crop.width,
			crop.height
		);

		return new Promise((resolve) => {
			canvas.toBlob((blob) => {
				blob.name = authUser.full_name + ".jpeg";
				resolve(blob);
			}, "image/jpeg");
		});
	};

	useEffect(() => {
		if (!completedCrop || !imageRef.current) {
			return;
		}

		getCroppedImg(imageRef.current, completedCrop).then((croppedBlob) => {
			setCroppedImage(croppedBlob);
		});
	}, [completedCrop]);

	const handleSavingProfileImage = async () => {
		const formData = new FormData();
		formData.append("image", croppedImage);

		try {
			const response = await axios.post(
				`${BaseUrl}accounts/users/change-profile-image`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (response.status === 200) {
				dispatch(updateUserProfileImage(response.data.image));
				setSelectedImage(null);
				setCroppedImage(null);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const editUserName = async () => {
		const [firstName, lastName] = authUser.full_name.split(" ");
		const { value: formValues } = await Swal.fire({
			title: "Enter your new username",
			html: `
              <input id="swal-input1" value=${firstName} placeholder="first name" class="swal2-input">
              <input id="swal-input2" value=${lastName} placeholder="last name" class="swal2-input">
            `,
			focusConfirm: false,
			confirmButtonText: "save",
			showCancelButton: true,
			preConfirm: () => {
				return [
					document.getElementById("swal-input1").value,
					document.getElementById("swal-input2").value,
				];
			},
		});
		if (formValues) {
			axios
				.post(`${BaseUrl}accounts/users/edit-username`, {
					first_name: formValues[0],
					last_name: formValues[1],
				})
				.then((response) => {
					dispatch(updateUserFullName(response.data.full_name));
					Swal.fire({
						text:
							"Your name changed to " +
							formValues[0] +
							" " +
							formValues[1],
						icon: "success",
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const editUserStatus = async () => {
		const inputValue = authUser.status;
		const { value: status } = await Swal.fire({
			title: "Enter your status",
			input: "text",
			inputValue,
			confirmButtonText: "save",
			showCancelButton: true,
			inputValidator: (value) => {
				if (!value) {
					return "You need to write something!";
				}
			},
		});
		if (status) {
			axios
				.post(`${BaseUrl}accounts/users/edit-status`, {
					status: status,
				})
				.then((response) => {
					dispatch(updateUserStatus(response.data.status));
					Swal.fire({
						text: "Your status changed to " + status,
						icon: "success",
					});
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const renderImageChangeAction = () => {
		if (imgChangeLoader) {
			return <BiLoaderAlt size={50} />;
		}
		if (croppedImage) {
			return (
				<IoIosCheckmarkCircle
					onClick={handleSavingProfileImage}
					className="image-save-btn"
					size={50}
				/>
			);
		}
	};

	const triggerFileInput = () => {
		inputRef.current.click();
	};

	return (
		<>
			{authUser && (
				<div className="profile-settings-container">
					<div className="profile-image-container">
						{selectedImage ? (
							<ReactCrop
								aspect={1}
								crop={crop}
								onComplete={onCropComplete}
								onChange={(newCrop) => setCrop(newCrop)}
							>
								<img
									onLoad={onImageLoaded}
									src={selectedImage}
									alt="cropped-profile.jpg"
								/>
							</ReactCrop>
						) : (
							<div onClick={triggerFileInput} className="image">
								<img
									src={
										"http://127.0.0.1:8000" + authUser.image
									}
									alt="profile.jpg"
								/>
							</div>
						)}
					</div>
					<div className="image-save-btn-container">
						{renderImageChangeAction()}
					</div>
					<input
						onChange={onSelectFile}
						style={{ display: "none" }}
						ref={inputRef}
						type="file"
						accept="image/*"
					/>
					<div className="settings-container">
						<div className="name">
							<h4>Your name</h4>
							<span>{authUser.full_name}</span>{" "}
							<GrEdit
								onClick={editUserName}
								className="username-edit-btn"
								size={20}
							/>
						</div>
						<div className="status">
							<h4>status</h4>
							<span> {authUser.status}</span>{" "}
							<GrEdit
								onClick={editUserStatus}
								className="username-edit-btn"
								size={20}
							/>
						</div>
					</div>
					<Logout />
				</div>
			)}
		</>
	);
};

export default ProfileSettings;
