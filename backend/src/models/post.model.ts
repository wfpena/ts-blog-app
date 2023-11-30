import { CommentModel } from "./comment.model";

export interface PostModel {
	id: string;
	title: string;
	content: string;
	createdAt: Date;
	updatedAt: Date;
}

export type PostModelDto = 
	Omit<PostModel, 'id' | 'createdAt' | 'updatedAt'> & { commentsCount?: number; comments?: CommentModel[]; };
