import {
	JsonController,
	Get,
	Param,
	Put,
	Post,
	Body,
	Delete,
} from 'routing-controllers';
import { CommentsService } from '../services/comments.service';
import { CommentModelDto } from '../models/comment.model';

@JsonController('/comments', { transformResponse: false })
export default class CommentsController {
	private _commentsService: CommentsService;

	constructor() {
		this._commentsService = new CommentsService();
	}

	@Post('')
	async addComment(@Body()comment: CommentModelDto) {
		try {
			const newComment = await this._commentsService.addComment(comment);
			return {
				status: 200,
				data: newComment,
			};
		} catch(err) {
			console.error(err);
			return {
				status: 500,
				error: err.message,
			};
		}
	}

	@Delete('/:commentId')
	async deletePost(@Param('commentId') commentId: string) {
		try {
			await this._commentsService.deleteComment(commentId);
			return {
				status: 200,
				data: commentId,
			};
		} catch (err) {
			console.error(err);
			return { status: 500, error: err.message };
		}
	}

	@Put('/:commentId')
	async updatePost(@Param('commentId') commentId: string, @Body() comment: Partial<CommentModelDto>) {
		try {
			const result = await this._commentsService.updateComment(commentId, comment);
			return {
				status: 200,
				data: result,
			};
		} catch (err) {
			console.error(err);
			return { status: 500, error: err.message };
		}
	}
}
