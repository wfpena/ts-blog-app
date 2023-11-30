import { Link } from 'react-router-dom';
import { Post as PostModel } from '../../models/post';
import PostPanel from './PostPanel';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { deleteEntity } from '../../utils/deleteEntity';

function PostsList() {
	const [posts, setPosts] = useState([] as PostModel[]);

	useEffect(() => {
		async function fetchPosts() {
			try {
				const appUrl = process.env.REACT_APP_API_URL;
				const response = await fetch(`${appUrl}/api/v1/posts`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
					},
				});
				const json = await response.json();
				setPosts(json.data);
			} catch (err) {
				toast.error(`Error getting posts. ${err.message}`);
			}
		}
		fetchPosts();
	}, []);

	const handlePostDelete = useCallback(
		(postId: string) => {
			async function makeDelete() {
				try {
					await deleteEntity('posts', postId);
					setPosts(posts.filter((p) => p.id !== postId));
					toast.success('Post deleted');
				} catch (err) {
					toast.error(`Error deleting post. ${err.message}`);
				}
			}
			makeDelete();
		},
		[posts],
	);

	return (
		<div className='blog-posts-container'>
			{posts.map((p) => {
				return (
					<Link key={p.id} to={`post/${p.id}`}>
						<PostPanel key={p.id} post={p} handleDelete={handlePostDelete}></PostPanel>
					</Link>
				);
			})}
		</div>
	);
}

export default PostsList;
