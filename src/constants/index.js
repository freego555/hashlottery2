import createHistory from 'history/createBrowserHistory';

// ----------------

// App version

export const appVersion = '0.1';

// App display name

export const displayAppName = 'Lifeline';

// Max size of mobile version

export const maxMobileSize = 1023; // 1023px

// Local storage names

export const localStorageNames = {
  token: 'life-line__token',
  lan: 'life-line__lan'
};

// Internal global object

export const _global = {};

// History object

export const history = createHistory();

// Redirect path

export const redirectPath = {
  withToken: '/main/dashboard',
  withoutToken: '/auth/login',
  afterMessageSent: '/main/messages?tab=team-messages'
};

// Accepted formats for file upload

export const acceptedFormats = ['.pdf', '.doc', '.jpg', '.jpeg', '.png'];

// Available languages

export const languages = ['FR', 'NL', 'EN'];
