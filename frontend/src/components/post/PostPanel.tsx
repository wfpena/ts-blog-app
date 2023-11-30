import { Trash3 } from 'react-bootstrap-icons';
import { Post as PostModel } from '../../models/post';
import { getContentSubstring } from '../../utils/helpers';

function PostPanel({
	post,
	handleDelete,
}: {
	post: PostModel;
	handleDelete: (postId: string) => void;
}) {
	return (
		<div className='blog-posts'>
			<div className='blog-post-title'>
				<div style={{ display: 'inline-block' }}>{post.title}</div>
				<div
					onClick={(ev) => {
						ev.preventDefault();
						handleDelete(post.id);
					}}
					className='blog-delete-post-button'
				>
					<Trash3></Trash3>
				</div>
			</div>
			<div className='blog-post-content'>{getContentSubstring(post.content)}</div>
			<div className='blog-post-footer'>
				<span style={{ color: 'gray' }}>Comments:</span>{' '}
				<span style={{ fontWeight: '500' }}>{post.commentsCount}</span>
			</div>
		</div>
	);
}

export default PostPanel;
