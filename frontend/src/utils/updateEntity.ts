import { Post } from '../models/post';
import { Comment } from '../models/comment';

export async function updateEntity(
	id: string,
	data: Partial<Post | Comment> & { id?: string; type: 'post' | 'comment' },
	entity: 'posts' | 'comments',
) {
	const appUrl = process.env.REACT_APP_API_URL;
	const response = await fetch(`${appUrl}/api/v1/${entity}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	const json = await response.json();
	return json;
}
