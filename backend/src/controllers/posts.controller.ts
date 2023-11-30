import {
	JsonController,
	Get,
	Param,
	Put,
	Post,
	Body,
	Delete,
} from 'routing-controllers';
import { PostsService } from '../services/posts.service';
import { PostModelDto } from '../models/post.model';

@JsonController('/posts', { transformResponse: false })
export default class PostsController {
	private _postsService: PostsService;

	constructor() {
		this._postsService = new PostsService();
	}

	@Get('')
	async getAll() {
		try {
			return {
				status: 200,
				data: await this._postsService.getPosts(),
			};
		} catch (err) {
			console.error(err);
			return { status: 500, error: err.message };
		}
	}

	@Get('/:postId')
	async getPostById(@Param('postId') postId: string) {
		try {
			const post = await this._postsService.getPostById(postId);
			return {
				status: 200,
				data: { post },
			};
		} catch (err) {
			console.error(err);
			return { status: 500, error: err.message };
		}
	}

	@Post('')
	async addPost(@Body() post: PostModelDto) {
		try {
			const createdPost = await this._postsService.addPost(post);
			return {
				status: 200,
				data: { post: createdPost },
			};
		} catch (err) {
			console.error(err);
			return { status: 500, error: err.message };
		}
	}

	@Delete('/:postId')
	async deletePost(@Param('postId') postId: string) {
		try {
			await this._postsService.deletePost(postId);
			return {
				status: 200,
				data: postId,
			};
		} catch (err) {
			console.error(err);
			return { status: 500, error: err.message };
		}
	}

	@Put('/:postId')
	async updatePost(@Param('postId') postId: string, @Body() post: Partial<PostModelDto>) {
		try {
			const result = await this._postsService.updatePost(postId, post);
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
