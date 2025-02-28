const convertTimestampToDate = (timestamp) => {
	if (!timestamp) return;

	const now = new Date();
	const date = new Date(timestamp);
	const currentDay = now.getDate();
	const options = { hour: "2-digit", minute: "2-digit", hour12: true };

	if (currentDay === date.getDate()) {
		return `Today at ${date.toLocaleString(undefined, options)}`;
	}
	if (parseInt(currentDay) - parseInt(date.getDate()) === 1) {
		return `Yesterday at ${date.toLocaleString(undefined, options)}`;
	}

	options["month"] = "long";
	options["day"] = "numeric";
	options["year"] = "numeric";

	return date.toLocaleString(undefined, options);
};

export const getDayMonthYear = (timestamp) => {
	if (!timestamp) return;
	const date = new Date(timestamp);
	const day = date.getDay();
	const month = date.getMonth();
	const year = date.getFullYear();

	return { day, month, year };
};

export default convertTimestampToDate;
