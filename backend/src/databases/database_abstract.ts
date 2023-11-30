import { IMemoryDb } from "pg-mem";
import { CommentModel, CommentModelDto } from "../models/comment.model";
import { PostModel, PostModelDto } from "../models/post.model";

export abstract class Database {
	public static _instance: IMemoryDb;

	private static getInstance() {}

	abstract getPosts(): Promise<PostModel[]>;
	
	abstract getPostById<T = any>(id: string): Promise<T>;

	abstract addPost(post: PostModelDto): Promise<PostModel>;

	abstract addComment(comment: CommentModelDto): Promise<CommentModel>;

	abstract deletePost(postId: string): Promise<void>;

	abstract deleteComment(commentId: string): Promise<void>;

	abstract getCommentsByPostId(postId: string): Promise<CommentModel[]>;

	abstract updatePost(id: string, post: Partial<PostModel>): Promise<any>;

	abstract updateComment(id: string, comment: Partial<CommentModel>): Promise<any>;

	abstract getById(id: string, table: string): Promise<any>;
}
