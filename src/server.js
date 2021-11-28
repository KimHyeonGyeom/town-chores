import { initializeDatabase } from './lib/database.js';
import App from './app.js';
import UserController from "./api/users/user.controller.js";
import PostController from "./api/post/post.controller.js";
import CommentController from "./api/comment/comment.controller.js";
import SearchController from "./api/search/search.controller.js";
import MypageController from "./api/mypage/mypage.controller.js";
import BlameController from "./api/blame/blame.controller.js";
import PushController from "./api/push/push.controller.js";

async function startServer() {
    await initializeDatabase();

     const app = new App([
         new UserController(),
         new PostController(),
         new CommentController(),
         new SearchController(),
         new MypageController(),
         new BlameController(),
         new PushController()
     ]);

    app.listen();
}
startServer();
