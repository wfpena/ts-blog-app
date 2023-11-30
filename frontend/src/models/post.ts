import { Comment } from './comment';

export interface Post {
	id: string;
	title: string;
	content: string;
	comments: Comment[];
	createdAt: Date;
	updatedAt: Date;
	commentsCount?: number;
}
