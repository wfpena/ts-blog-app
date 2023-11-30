import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import PostDetails, { loader as postLoader } from './components/post/PostDetails';
import PostsList from './components/post/PostList';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		children: [
			{
				path: '/',
				element: <PostsList></PostsList>,
			},
			{
				path: '/post/:postId',
				loader: postLoader,
				element: <PostDetails />,
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);

reportWebVitals();
