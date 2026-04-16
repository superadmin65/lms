// -- --- Start  of recently edited files   -----------------
// --- Auth ---
export const POST_LMS_LOGIN = "/auth/login";

// --- Dashboard & Analytics ---
export const GET_LATEST_USERS = "/v1/users/latest";
export const GET_REGISTRATION_COUNT = "/user/registration-count";
export const GET_USER_PERFORMANCE = "/user/performance";
export const GET_USER_ANALYTICS = "/user/analytics";

// --- Staff & Users ---
export const STAFF_API = "/staff-api/staff";
export const GET_ALL_USERS = "/v1/users/all";

// --- Manage Cards Endpoints ---
export const GET_CONFIG = "/v1/konzeptes/config";
export const POST_MANAGE_CARD = "/v1/konzeptes/manage-card";
export const UPLOAD_ICON = "/v1/konzeptes/upload/icon";
export const UPLOAD_BG = "/v1/konzeptes/upload/bg";

// --- Activity Management Endpoints ---
export const GET_CARDS_CONFIG = "/v1/konzeptes/config";
export const SAVE_ACTIVITY = "/admin/save";
export const SAVE_COMPLETE_WORD = "/admin/save_completeword";

// --- Activity List Endpoints ---
export const GET_ACTIVITY_LIST = "/admin/list";
export const DELETE_ACTIVITY = "/admin/delete";

// --- Profile Endpoints ---
export const POST_USER_PROFILE = "/user-api/profile";

// --- Manage Cards Endpoints ---
// --- Card Image & Upload Endpoints ---
export const GET_CARD_ICON = "/v1/konzeptes/image/icon";
export const GET_CARD_BG = "/v1/konzeptes/image/bg";

// -----------------   end of recently edited files   -----------------
//REGISTER
export const POST_FAKE_REGISTER = "/post-fake-register";

//LOGINords/lms/auth/login
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/post-fake-profile";

//PRODUCTS
export const GET_PRODUCTS = "/products";
export const GET_PRODUCTS_DETAIL = "/product";

//Mails
export const GET_MAILS_LIST = "/mailslists";
export const SELECT_FOLDER = "/folders";
export const GET_SELECTED_MAILS = "/selectedmails";
export const SET_FOLDER_SELECTED_MAILS = "/setfolderonmail";
export const UPDATE_MAIL = "/update/mail";

//CALENDER
export const GET_EVENTS = "/events";
export const ADD_NEW_EVENT = "/add/event";
export const UPDATE_EVENT = "/update/event";
export const DELETE_EVENT = "/delete/event";
export const GET_CATEGORIES = "/categories";

//CHATS
export const GET_CHATS = "/chats";
export const GET_GROUPS = "/groups";
export const GET_CONTACTS = "/contacts";
export const GET_MESSAGES = "/messages";
export const ADD_MESSAGE = "/add/messages";

//ORDERS
export const GET_ORDERS = "/orders";
export const ADD_NEW_ORDER = "/add/order";
export const UPDATE_ORDER = "/update/order";
export const DELETE_ORDER = "/delete/order";

//CART DATA
export const GET_CART_DATA = "/cart";

//CUSTOMERS
export const GET_CUSTOMERS = "/customers";
export const ADD_NEW_CUSTOMER = "/add/customer";
export const UPDATE_CUSTOMER = "/update/customer";
export const DELETE_CUSTOMER = "/delete/customer";

//SHOPS
export const GET_SHOPS = "/shops";

//CRYPTO
export const GET_WALLET = "/wallet";
export const GET_CRYPTO_ORDERS = "/crypto/orders";
export const GET_CRYPTO_PRODUCTS = "/crypto-products";

//INVOICES
export const GET_INVOICES = "/invoices";
export const GET_INVOICE_DETAIL = "/invoice";

// JOBS
export const GET_JOB_LIST = "/jobs";
export const ADD_NEW_JOB_LIST = "/add/job";
export const UPDATE_JOB_LIST = "/update/job";
export const DELETE_JOB_LIST = "/delete/job";

//Apply Jobs
export const GET_APPLY_JOB = "/jobApply";
export const DELETE_APPLY_JOB = "add/applyjob";

//PROJECTS
export const GET_PROJECTS = "/projects";
export const GET_PROJECT_DETAIL = "/project";
export const ADD_NEW_PROJECT = "/add/project";
export const UPDATE_PROJECT = "/update/project";
export const DELETE_PROJECT = "/delete/project";

//TASKS
export const GET_TASKS = "/tasks";

//CONTACTS
export const GET_USERS = "/users";
export const GET_USER_PROFILE = "/user";
export const ADD_NEW_USER = "/add/user";
export const UPDATE_USER = "/update/user";
export const DELETE_USER = "/delete/user";

//Blog
export const GET_VISITOR_DATA = "/visitor-data";

//dashboard charts data
export const GET_WEEKLY_DATA = "/weekly-data";
export const GET_YEARLY_DATA = "yearly-data/";
export const GET_MONTHLY_DATA = "/monthly-data";

export const TOP_SELLING_DATA = "/top-selling-data";

//dashboard crypto
export const GET_WALLET_DATA = "/wallet-balance-data";

//dashboard jobs
export const GET_STATISTICS_DATA = "/Statistics-data";

export const GET_EARNING_DATA = "/earning-charts-data";

export const GET_PRODUCT_COMMENTS = "/comments-product";

export const ON_LIKNE_COMMENT = "/comments-product-action";

export const ON_ADD_REPLY = "/comments-product-add-reply";

export const ON_ADD_COMMENT = "/comments-product-add-comment";
