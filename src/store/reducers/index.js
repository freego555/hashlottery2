import { combineReducers } from 'redux';

// Reducers

import messages from './messages';
import network from './network';
import config from './config';
import tasks from './tasks';
import users from './users';
import user from './user';
import ui from './ui';

// ----------------

export default combineReducers({ network, user, config, users, tasks, messages, ui });
