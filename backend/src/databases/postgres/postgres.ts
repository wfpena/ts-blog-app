import { CommentModelDto, CommentModel } from '../../models/comment.model';
import { PostModel, PostModelDto } from '../../models/post.model';
import { Database } from '../database_abstract';
import { newDb, IMemoryDb, QueryResult } from 'pg-mem';
import { v4 as uuid4 } from 'uuid';
import { loadData } from '../../../scripts/base-data';

export class PostgreStrategy extends Database {
	_instance: IMemoryDb;

	constructor() {
		super();
		this.getInstance();
	}

	private async getInstance(): Promise<IMemoryDb> {
		const db = newDb();

		db.public.many(`
			CREATE TABLE posts (
				id uuid PRIMARY KEY,
				title VARCHAR(255) NOT NULL,
				content TEXT NOT NULL,
				"createdAt" timestamp,
				"updatedAt" timestamp
			);
		`);

		db.public.many(`
			CREATE TABLE comments (
				id uuid PRIMARY KEY,
				content TEXT NOT NULL,
				"userName" VARCHAR(50),
				"parentPostId" uuid,
				"createdAt" timestamp,
				"updatedAt" timestamp,
				CONSTRAINT fk_parent_post_id FOREIGN KEY ("parentPostId") REFERENCES posts (id) ON DELETE CASCADE
			);
		`);

		if (false) {
			await loadData(db);
		}

		PostgreStrategy._instance = db;

		return db;
	}

	public async getPosts() {
		return PostgreStrategy._instance.public.many(`
			SELECT p.id "id", p.title "title", p.content "content", p."createdAt" "createdAt", p."updatedAt" "updatedAt", COALESCE(c.count, 0) "commentsCount"
			FROM posts p 
			LEFT JOIN (SELECT count(*) as count, "parentPostId" FROM comments GROUP BY "parentPostId") as c
			ON c."parentPostId" = p.id
			ORDER BY p."createdAt" DESC
		`);
	}

	public async getPostById(id: string) {
		return this.getById(id, 'posts');
	}

	public async addPost(post: PostModelDto): Promise<PostModel> {
		const uuid = uuid4();
		return PostgreStrategy._instance.public.getTable('posts').insert({ id: uuid, ...post, createdAt: new Date(), updatedAt: new Date() });
	}

	public async addComment(comment: CommentModelDto): Promise<CommentModel> {
		const uuid = uuid4();
		const newComment = { id: uuid, ...comment, createdAt: new Date(), updatedAt: new Date() };
		await PostgreStrategy._instance.public.getTable('comments').insert(newComment);
		return newComment;
	}

	public async deleteValuesByID(id: string, table: string): Promise<QueryResult> {
		return PostgreStrategy._instance.public.query({
			type: 'delete',
			from: { name: table },
			where: {
				type: 'binary',
				left: { type: 'ref', name: 'id' },
				right: { type: 'string', value: id },
				op: '=',
			},
		});
	}

	public async deleteComment(id: string) {
		await this.deleteValuesByID(id, 'comments');
	}

	public async deletePost(id: string): Promise<void> {
		await this.deleteValuesByID(id, 'posts');
	}

	public async getById(id: string, table: string) {
		return PostgreStrategy._instance.public.one({
			type: 'select',
			columns: [{expr: {type: 'ref', name: '*'}}],
			from: [{
				type: 'table',
				name: { name: table },
			}],
			where: {
				type: 'binary',
				left: { type: 'ref', name: 'id' },
				right: { type: 'string', value: id },
				op: '=',
			},
		});
	}

	public async getCommentsByPostId(postId: string): Promise<CommentModel[]> {
		const queryResult = await PostgreStrategy._instance.public.query({
			type: 'select',
			columns: [{expr: {type: 'ref', name: '*'}}],
			from: [{
				type: 'table',
				name: { name: 'comments' },
			}],
			where: {
				type: 'binary',
				left: { type: 'ref', name: 'parentPostId' },
				right: { type: 'string', value: postId },
				op: '=',
			},
		});
		return queryResult.rows;
	}

	public async updatePost(id: string, post: Partial<PostModel>): Promise<any> {
		return this.updateEntity(id, { ...post, updatedAt: new Date() }, 'posts');
	}

	public async updateComment(id: string, comment: Partial<CommentModel>): Promise<any> {
		return this.updateEntity(id, { ...comment, updatedAt: new Date() }, 'comments');
	}

	public async updateEntity(id: string, data: any, table: string) {
		const { updateSet, updatedColumns } = Object.entries(data).reduce((acc, [k,v]) => {
			if (!v) return acc;
			const columnUpdate = { column: { name: k }, value: { type: 'string', value: v } };
			acc.updateSet.push(columnUpdate);
			acc.updatedColumns[k] = v;
			return acc;
		}, {updateSet:[] as any[], updatedColumns: {} as any});
		await PostgreStrategy._instance.public.query({
			type: 'update',
			table: { name: table },
			sets: updateSet,
			where: {
				type: 'binary',
				left: { type: 'ref', name: 'id' },
				right: { type: 'string', value: id },
				op: '=',
			},
		});
		return updatedColumns;
	}
}
