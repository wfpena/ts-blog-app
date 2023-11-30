import { toast } from 'react-toastify';

export async function deleteEntity(entity: 'posts' | 'comments', id: string) {
	const appUrl = process.env.REACT_APP_API_URL;
	const response = await fetch(`${appUrl}/api/v1/${entity}/${id}`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const json = await response.json();
	toast.success(`${entity === 'posts' ? 'Post' : 'Comment'} deleted successfully`);
	return json;
}
