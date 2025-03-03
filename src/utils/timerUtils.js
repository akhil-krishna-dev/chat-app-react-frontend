export const getCallingDuration = (callingDuration) => {
	const minute = Math.floor(callingDuration / 60);
	const second = callingDuration % 60;
	return `${minute < 10 ? 0 : ""}${minute}:${second < 10 ? 0 : ""}${second}`;
};
