import { Card } from 'react-bootstrap';
import { Comment as CommentModel } from '../../models/comment';
import { Pencil, Trash3 } from 'react-bootstrap-icons';

function Comment({
	comment,
	onDelete,
	handleEditComment,
}: {
	comment: CommentModel;
	onDelete: (commentId: string) => void;
	handleEditComment: (data: CommentModel) => void;
}) {
	return (
		<>
			<Card style={{ margin: '10px' }}>
				<Card.Header>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<div style={{ flex: '1' }}>
							<b>User:</b> {comment.userName}
						</div>
						<div>{comment.createdAt?.toString()}</div>
						<div
							onClick={() => onDelete(comment.id)}
							style={{ marginLeft: '10px', color: 'red', cursor: 'pointer' }}
						>
							<Trash3></Trash3>
						</div>
						<div
							onClick={() => handleEditComment(comment)}
							style={{ marginLeft: '10px', color: 'blue', cursor: 'pointer' }}
						>
							<Pencil></Pencil>
						</div>
					</div>
				</Card.Header>
				<Card.Body>{comment.content}</Card.Body>
			</Card>
		</>
	);
}

export default Comment;
