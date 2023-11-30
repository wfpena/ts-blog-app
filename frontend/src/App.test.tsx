import { render, screen } from '@testing-library/react';
import App from './App';

test('renders BlogJS header', () => {
	render(<App />);
	const linkElement = screen.getByText(/BlogJS/i);
	expect(linkElement).toBeInTheDocument();
});
