import { useLoaderData, useNavigate } from 'react-router-dom';
import { Post as PostModel } from '../../models/post';
import { Comment as CommentModel } from '../../models/comment';
import CommentComponent from '../comment/Comment';
import { Button, Card, Modal } from 'react-bootstrap';
import { useCallback, useEffect, useState } from 'react';
import { PlusLg, ArrowLeft, Pencil, Trash } from 'react-bootstrap-icons';
import GenericForm, { GenericFormInputType } from '../common/GenericForm';
import { updateEntity } from '../../utils/updateEntity';
import fetchPost from '../../utils/fetchPost';
import { toast } from 'react-toastify';
import { deleteEntity } from '../../utils/deleteEntity';

export async function loader({
	params,
}: {
	params: { postId?: string };
}): Promise<{ post: PostModel }> {
	if (!params.postId) {
		throw new Error('Invalid post id parameter');
	}
	const json = await fetchPost(params.postId);
	return json.data.post || {};
}

function PostDetails() {
	const currentPost = useLoaderData() as PostModel;
	const [post, setCurrentPost] = useState({ ...currentPost });
	const [showCommentForm, setShowCommentForm] = useState(false);
	const [showEditModal, setShowEditModal] = useState(false);
	const [initialEditValues, setInitialEditValues] = useState({
		type: 'post' as 'post' | 'comment',
	});
	const navigate = useNavigate();

	useEffect(() => {
		if (!currentPost || !currentPost.id) {
			navigate('/');
		}
	}, []);

	const handleEditComment = useCallback((comment) => {
		setInitialEditValues({ ...comment, type: 'comment' });
		setShowEditModal(true);
	}, []);

	const handleCommentDelete = useCallback(
		(commentId: string) => {
			async function deleteComment() {
				await deleteEntity('comments', commentId);
				const newPost = await fetchPost(post.id);
				setCurrentPost(newPost.data.post);
			}
			deleteComment();
		},
		[post],
	);

	const handleCommentSubmit = useCallback(
		(data: Partial<CommentModel>) => {
			async function createComment() {
				const appUrl = process.env.REACT_APP_API_URL;
				const response = await fetch(`${appUrl}/api/v1/comments`, {
					method: 'POST',
					headers: {
						Accept: 'application/json',
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						...data,
						parentPostId: post.id,
					}),
				});
				const json = await response.json();
				const addedComment = json.data;
				setShowCommentForm(false);
				post.comments.push(addedComment);
				setCurrentPost({ ...post, comments: post.comments });
			}
			createComment();
		},
		[post],
	);

	const handlePostDelete = useCallback((postId: string) => {
		async function makeDelete() {
			try {
				await deleteEntity('posts', postId);
				navigate('/');
			} catch (err) {
				toast.error(`Error deleting post. ${err.message}`);
			}
		}
		makeDelete();
	}, []);

	const handleEditModalSubmit = useCallback(
		(data: GenericFormInputType) => {
			async function makeUpdate() {
				try {
					if (!data.id) {
						throw new Error('Error calling update. Invalid id.');
					}
					const entity = data.type === 'comment' ? 'comments' : 'posts';
					const response = await updateEntity(data.id, data, entity);
					setShowEditModal(false);
					if (entity === 'posts') {
						setCurrentPost(response.data);
					} else {
						const updatedComments = post.comments.map((c) => {
							if (c.id === data.id) {
								return { ...c, ...data };
							}
							return c;
						});
						setCurrentPost({
							...post,
							comments: updatedComments,
						});
					}
				} catch (err) {
					toast.error(`Error updating value. ${err.message}`);
				}
			}
			makeUpdate();
		},
		[post],
	);

	return (
		<>
			<div className='blog-post-details-container'>
				<Card style={{ marginTop: '10px' }}>
					<Card.Header as='h5' style={{ textAlign: 'center', display: 'flex' }}>
						<ArrowLeft
							style={{ cursor: 'pointer' }}
							onClick={() => {
								navigate('/');
							}}
						></ArrowLeft>
						<div style={{ flex: '1' }}>{post?.title}</div>
					</Card.Header>
					<Card.Body>
						<Card.Text>{post?.content}</Card.Text>
					</Card.Body>
					<Card.Footer>
						<Button
							onClick={() => handlePostDelete(post.id)}
							style={{ float: 'right' }}
							variant='danger'
						>
							<Trash></Trash>Delete Post
						</Button>
						<Button
							onClick={() => {
								setInitialEditValues({ ...post, type: 'post' });
								setShowEditModal(true);
							}}
							style={{ float: 'right', marginRight: '10px' }}
							variant='primary'
						>
							<Pencil></Pencil>Edit Post
						</Button>
					</Card.Footer>
				</Card>
				<Button onClick={() => setShowCommentForm(true)} style={{ margin: '10px' }}>
					<PlusLg></PlusLg>Add a Comment
				</Button>
				{showCommentForm && (
					<div className='blog-comments-container'>
						<GenericForm
							closeModal={() => setShowCommentForm(false)}
							initialValues={{ type: 'comment' }}
							onSubmit={handleCommentSubmit}
						/>
					</div>
				)}
				<Card style={{ marginTop: '20px' }}>
					<div style={{ margin: '10px' }}>Comments:</div>
					{post?.comments?.map((comment) => (
						<CommentComponent
							key={comment.id}
							comment={comment}
							onDelete={handleCommentDelete}
							handleEditComment={handleEditComment}
						></CommentComponent>
					))}
				</Card>
			</div>
			<Modal show={showEditModal}>
				<GenericForm
					initialValues={initialEditValues}
					onSubmit={handleEditModalSubmit}
					closeModal={() => {
						setShowEditModal(false);
					}}
				/>
			</Modal>
		</>
	);
}

export default PostDetails;
