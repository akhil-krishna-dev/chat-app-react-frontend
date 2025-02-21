const convertTimestampToDate = (timestamp) => {
	if (!timestamp) return;

	const now = new Date();
	const date = new Date(timestamp);
	const currentDay = now.getDate();
	const options = { hour: "2-digit", minute: "2-digit", hour12: true };

	if (currentDay === date.getDate()) {
		return `today ${date.toLocaleString(undefined, options)}`;
	}
	if (parseInt(currentDay) - parseInt(date.getDate()) === 1) {
		return `yesterday ${date.toLocaleString(undefined, options)}`;
	}

	options["month"] = "long";
	options["day"] = "numeric";
	options["year"] = "numeric";

	return date.toLocaleString(undefined, options);
};

export default convertTimestampToDate;
