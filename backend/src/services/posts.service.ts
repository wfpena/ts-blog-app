import { Database } from '../databases/database_abstract';
import { DatabaseInstanceStrategy } from '../database';
import { PostModel, PostModelDto } from '../models/post.model';

export class PostsService {
	private readonly _db: Database;

	constructor() {
		this._db = DatabaseInstanceStrategy.getInstance();
	}

	public async getPosts(): Promise<PostModelDto[]> {
		return this._db.getPosts();
	}

	public async getPostById(id: string): Promise<PostModel | null> {
		const post = await this._db.getPostById(id);
		if (!post) return null;
		const comments = await this._db.getCommentsByPostId(id);
		return { ...post, comments };
	}

	public async addPost(post: PostModelDto): Promise<PostModel> {
		if (!post.content || !post.title) {
			throw new Error('Post is missing title or content');
		}
		const createdPost = await this._db.addPost(post);
		return createdPost;
	}

	public async deletePost(id: string) {
		if (!id) throw new Error('Invalid post id');
		await this._db.deletePost(id);
	}

	public async updatePost(postId: string, post: Partial<PostModel>) {
		if (!post) throw new Error('Invalid data for post update');
		const allowedFields = {
			title: post.title || undefined,
			content: post.content || undefined,
		};
		const updatedCols = await this._db.updatePost(postId, allowedFields);
		const currentPost = await this.getPostById(postId);
		if (!currentPost) return null;
		return { ...currentPost, ...updatedCols };
	}
}
