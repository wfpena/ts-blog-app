import { Database } from '../databases/database_abstract';
import { DatabaseInstanceStrategy } from '../database';
import { CommentModelDto } from '../models/comment.model';

export class CommentsService {
	private readonly _db: Database;

	constructor() {
		this._db = DatabaseInstanceStrategy.getInstance();
	}

	public async addComment(comment: CommentModelDto) {
		if (!comment.parentPostId) {
			throw new Error('Invalid parent post id.');
		}
		return this._db.addComment(comment);
	}

	public async deleteComment(id: string) {
		if (!id) throw new Error('Invalid comment id');
		await this._db.deleteComment(id);
	}

	public async getCommentsByPostId(postId: string) {
		return this._db.getCommentsByPostId(postId);
	}

	public async updateComment(commentId: string, comment: Partial<CommentModelDto>) {
		if (!comment || !commentId) throw new Error('Invalid data for comment update');
		const allowedFields = {
			userName: comment.userName || undefined,
			content: comment.content || undefined,
		};
		const updatedCols = await this._db.updateComment(commentId, allowedFields);
		const currentComment = await this._db.getById(commentId, 'comments');
		if (!currentComment) return null;
		return { ...currentComment, ...updatedCols };
	}
}
