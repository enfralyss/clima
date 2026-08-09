process.env.EXPO_PUBLIC_OWM_API_KEY = 'test-key';

// React 19 requires flagging the test environment for act() to work
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
