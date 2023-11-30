import { Post } from '../models/post';
import { Comment } from '../models/comment';
import { toast } from 'react-toastify';

export async function createEntity(entity: 'posts' | 'comments', data: Partial<Post | Comment>) {
	const appUrl = process.env.REACT_APP_API_URL;
	const response = await fetch(`${appUrl}/api/v1/${entity}`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	const json = await response.json();
	toast.success(`${entity === 'posts' ? 'Post' : 'Comment'} created successfully.`);
	return json;
}
