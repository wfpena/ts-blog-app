export const getContentSubstring = (text: string) => {
	const maxLength = 330;
	if (text.length <= maxLength) return text;
	else return text.substring(0, 320) + '...';
};
