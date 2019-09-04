import React from 'react';
import { MuiThemeProvider } from '@material-ui/core';
import { BrowserRouter, Route } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';

import { theme } from './themes/theme';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
import Post from './pages/PostPage';

import './App.css';

function App() {
	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Route path="/" exact component={Landing} />
				<Route path="/profile/:userID" exact component={Profile} />
				<Route path="/profile/:userID/posts/:postID" exact component={Post} />
			</BrowserRouter>
		</MuiThemeProvider>
	);
}

export default App;
