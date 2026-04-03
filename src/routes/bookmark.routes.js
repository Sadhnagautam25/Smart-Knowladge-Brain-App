import express from "express";
import { IdentifyUser } from "../middlewares/auth.middleware.js";
import {
  createBookmarkController,
  deleteBookmarkController,
  deleteFolderController,
  getBookmarksController,
  getGraphController,
  getSingleBookmarkController,
  moveBookmarkFolder,
  relatedBookmarksController,
  renameFolderController,
  semanticSearchController,
  toggleFavoriteController,
  updateBookmarkController,
} from "../controllers/bookmark.controller.js";

const bookmarkRouter = express.Router();
// bookmarkRouter prifix => /api

// create a bookmark api 1️⃣
// api name => /api/bookmark
// api method => POST
// status code => 201

bookmarkRouter.post("/bookmark", IdentifyUser, createBookmarkController);

// get all bookmarks api 2️⃣
// api name => /api/bookmarks
// api method => GET
// status code => 200

bookmarkRouter.get("/bookmarks", IdentifyUser, getBookmarksController);

// get single bookmark using bookmarkId api 3️⃣
// api name => /api/bookmark/:id
// api method => GET
// status code => 200

bookmarkRouter.get("/bookmark/:id", IdentifyUser, getSingleBookmarkController);

// update bookmark using bookmarkId api 4️⃣
// api name => /api/bookmark/update/:id
// api method => PUT
// status code => 200

bookmarkRouter.put(
  "/bookmark/update/:id",
  IdentifyUser,
  updateBookmarkController,
);

// delete bookmark using bookmarkId api 5️⃣
// api name => /api/bookmark/delete/:id
// api method => DELETE
// status code => 200

bookmarkRouter.delete(
  "/bookmark/delete/:id",
  IdentifyUser,
  deleteBookmarkController,
);

// Favorite toggle bookmark using bookmarkId api 6️⃣
// api name => /api/bookmark/:id/favorite
// api method => PATCH
// status code => 200

bookmarkRouter.patch(
  "/bookmark/:id/favorite",
  IdentifyUser,
  toggleFavoriteController,
);

// rename folder api 6️⃣
// api name => /api/folder/rename
// api method => PATCH
// status code => 200

bookmarkRouter.patch("/folder/rename", IdentifyUser, renameFolderController);

// delete folder api 6️⃣
// api name => /api/folder/delete
// api method => DELETE
// status code => 200

bookmarkRouter.delete("/folder/delete", IdentifyUser, deleteFolderController);

bookmarkRouter.get("/semantic-search", IdentifyUser, semanticSearchController);

bookmarkRouter.get("/related/:id", IdentifyUser, relatedBookmarksController);

bookmarkRouter.patch("/move/:id", moveBookmarkFolder);

bookmarkRouter.get("/graph", IdentifyUser, getGraphController);

export default bookmarkRouter;
