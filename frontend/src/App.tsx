import { useCallback, useState } from 'react';
import './App.css';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button, Modal } from 'react-bootstrap';
import GenericForm, { GenericFormInputType } from './components/common/GenericForm';
import { createEntity } from './utils/createEntity';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
	const [showModal, setShowModal] = useState(false);
	const navigate = useNavigate();
	const location = useLocation();

	const handlePostSubmit = useCallback((data: GenericFormInputType) => {
		async function createPost() {
			const json = await createEntity('posts', data);
			setShowModal(false);
			navigate(`/post/${json.data.post.id}`);
		}
		createPost();
	}, []);

	return (
		<div className='App'>
			<header className='App-header'>
				<Link to={'/'} style={{ flex: 1 }}>
					<span>BlogJS</span>
				</Link>
			</header>
			{location.pathname === '/' && (
				<div style={{ margin: '20px auto' }}>
					<Button variant='primary' onClick={() => setShowModal(true)}>
						Create New Post
					</Button>
				</div>
			)}
			<Modal show={showModal}>
				<GenericForm
					initialValues={{ type: 'post' }}
					onSubmit={handlePostSubmit}
					closeModal={() => setShowModal(false)}
				/>
			</Modal>
			<Outlet />
			<ToastContainer autoClose={1500} />
		</div>
	);
}

export default App;
