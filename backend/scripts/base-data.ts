import { IMemoryDb } from "pg-mem";
import { PostModel } from "../src/models/post.model";
import { v4 as uuid4 } from 'uuid';
import { CommentModel } from "../src/models/comment.model";

function generateText(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export const loadData = async (db: IMemoryDb) => {
	const posts = [...Array(100).fill(0).map(x => {
		const post: PostModel = {
			id: uuid4(),
			content: generateText(Math.floor(Math.random()*1000)),
			title: generateText(20),
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		return post;
	})];


	for (const post of posts) {
		await db.public.getTable('posts').insert(post);
	}

	console.log(` --- Loaded ${posts.length} posts to DB ---`);

	const getRandomPostId = () => posts[Math.floor(Math.random()*posts.length)].id;


	const comments = [...Array(500).fill(0).map(x => {
		const comment: CommentModel = {
			id: uuid4(),
			content: generateText(100),
			userName: generateText(20),
			parentPostId: getRandomPostId(),
			createdAt: new Date(),
			updatedAt: new Date(),
		}
		return comment;
	})];

	for (const comment of comments) {
		await db.public.getTable('comments').insert(comment);
	}

	console.log(` --- Loaded ${comments.length} comments to DB ---`)
}
