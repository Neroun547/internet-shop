import { createArticleItem } from "../common/create-article-item.js";

const loadMoreArticlesBtn = document.querySelector(".load-more-articles-btn");
const wrapperArticles = document.querySelector(".wrapper__articles");
let skip = 10;


if(loadMoreArticlesBtn) {
    loadMoreArticlesBtn.addEventListener("click", async function () {

        if (skip) {
            const api = await fetch("/articles/articles?count=10&skip=" + skip);
            const response = await api.json();

            for (let i = 0; i < response.length; i++) {
                wrapperArticles.appendChild(createArticleItem(response[i].name, response[i].theme, response[i].authors, response[i].created_at, response[i].filename));
            }
            if (response.length < 10) {
                skip = 0;

                loadMoreArticlesBtn.remove();
            } else {
                skip += 10;
            }
        }
    });
}

