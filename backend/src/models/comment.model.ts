export interface CommentModel {
	id: string;
	content: string;
	userName: string;
	parentPostId?: string;
	createdAt: Date;
	updatedAt: Date;
}

export type CommentModelDto = 
	Omit<CommentModel, 'id' | 'createdAt' | 'updatedAt'> & { parentPostId: string; parentCommentId: string; };
