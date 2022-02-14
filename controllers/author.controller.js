const Article = require("../models/article.model");

exports.getPosts = (req, res, next) => {
  Article.fetchAll()
    .then((articles) => {
      const tempArticle = articles.map((i) => ({
        ...i,
        description: `${i.description.slice(0, 30)}.....`,
      }));

      res.render("author/author-article-list", {
        pageTitle: "All Posts",
        articles: tempArticle,
      });
    })
    .catch((err) => console.log(err));
};

exports.getAddPost = (req, res, next) => {
  res.render("post/add-edit-post", {
    pageTitle: "Creat a post",
    editing: false,
  });
};

exports.postAddPost = (req, res, next) => {
  const { title, imageUrl, description } = req.body;

  const article = new Article(title, imageUrl, description);
  article.save();
  res.redirect("/");
};

exports.getEditPost = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) res.redirect("/");

  const postId = req.params.postId;
  Article.findById(postId)
    .then((article) => {
      res.render("post/add-edit-post", {
        pageTitle: "Edit Article",
        editing: editMode,
        article: article,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditPost = (req, res, next) => {
  const { postId, title, imageUrl, description } = req.body;
  const updatedPost = new Article(title, imageUrl, description);
  updatedPost.edit(postId);
  res.redirect("/author");
};

exports.postDeletePost = (req, res, next) => {
  const postId = req.body.postId;
  Article.deleteById(postId);
};
