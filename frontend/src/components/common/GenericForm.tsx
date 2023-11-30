import { memo } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

export type GenericFormInputType = Partial<Comment & Post> & { type: 'post' | 'comment' };

const GenericForm = memo(function GenericForm({
	onSubmit,
	closeModal,
	initialValues,
}: {
	onSubmit: (data: GenericFormInputType) => void;
	closeModal: () => void;
	initialValues: GenericFormInputType;
}) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		defaultValues: initialValues,
	});

	return (
		<Form onSubmit={handleSubmit(onSubmit)} style={{ margin: '20px' }}>
			{initialValues.type === 'post' && (
				<Form.Group className='mb-3' controlId='formBasicTitle'>
					<Form.Label>Title</Form.Label>
					<Form.Control
						type='text'
						placeholder='Post Title'
						{...register('title', { required: 'Title is required' })}
					/>
					{errors.title && (
						<Form.Text className='text-danger'>{errors.title?.message?.toString()}</Form.Text>
					)}
				</Form.Group>
			)}
			{initialValues.type === 'comment' && (
				<Form.Group className='mb-3' controlId='formBasicUserName'>
					<Form.Label>Username</Form.Label>
					<Form.Control
						type='text'
						placeholder='Username'
						{...register('userName', { required: 'Username is required' })}
					/>
					{errors.userName && (
						<Form.Text className='text-danger'>{errors.userName?.message?.toString()}</Form.Text>
					)}
				</Form.Group>
			)}
			<Form.Group className='mb-3' controlId='formBasicContent'>
				<Form.Label>Content</Form.Label>
				<Form.Control
					as='textarea'
					rows={5}
					placeholder='Write your post...'
					{...register('content', { required: 'Content is required' })}
				/>
				{errors.content && (
					<Form.Text className='text-danger'>{errors.content?.message?.toString()}</Form.Text>
				)}
			</Form.Group>
			<Button style={{ margin: '10px 10px 10px 0px' }} variant='primary' type='submit'>
				Submit
			</Button>
			<Button style={{ margin: '10px' }} variant='primary' onClick={closeModal}>
				Close
			</Button>
		</Form>
	);
});

export default GenericForm;
