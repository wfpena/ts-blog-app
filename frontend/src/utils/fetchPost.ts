export default async function fetchPost(postId: string) {
	const appUrl = process.env.REACT_APP_API_URL;
	const response = await fetch(`${appUrl}/api/v1/posts/${postId}`);
	const json = await response.json();
	return json;
}
