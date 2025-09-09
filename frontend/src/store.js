
import { createStore, combineReducers } from 'redux';

// Action Types
const SET_AUTH_USER = 'SET_AUTH_USER';
const SET_CONVERSATIONS = 'SET_CONVERSATIONS';

// Action Creators
export const setAuthUser = (authUser) => ({
    type: SET_AUTH_USER,
    payload: authUser,
});

export const setConversations = (conversations) => ({
    type: SET_CONVERSATIONS,
    payload: conversations,
});


const authReducer = (state = { authUser: null }, action) => {
    switch (action.type) {
        case SET_AUTH_USER:
            return {
                ...state,
                authUser: action.payload,
            };
        default:
            return state;
    }
};

const conversationsReducer = (state = { conversations: [] }, action) => {
    switch (action.type) {
        case SET_CONVERSATIONS:
            return {
                ...state,
                conversations: action.payload,
            };
        default:
            return state;
    }
};

const rootReducer = combineReducers({
    auth: authReducer,
    conversations: conversationsReducer,
});

const store = createStore(rootReducer);

export default store;
