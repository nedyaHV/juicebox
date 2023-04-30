const express = require("express");
const tagsRouter = express.Router();

const { getAllTags, getPostsByTagName } = require("../db")


tagsRouter.get("/:tagName/posts", async (req, res, next) => {
    const { tagName } = req.params;

    console.log(tagName);
    try {
        const postTagName = await getPostsByTagName(tagName);
            res.send({ post: postTagName });

    } catch ({ name, message }) {
        next({
            name: "TagNameError",
            message: "The post with tags is unavailable"
        });
    }
});

tagsRouter.get("/", async (req,res) => {
    try {
        const tags = await getAllTags();

        res.send({
            tags
        });
    } catch (error) {
        console.log(error);
    }
});

module.exports = tagsRouter;