import { questionModal } from "../../common/question-modal.js";
import {createArticleItem} from "../../common/create-article-item.js";

const wrapperArticles = document.querySelector(".wrapper__articles");
const deleteArticleBtn = document.querySelectorAll(".wrapper__articles-item-del-btn");
const loadMoreArticlesBtn = document.querySelector(".load-more-articles-btn");

let skip = 10;

for(let i = 0; i < deleteArticleBtn.length; i++) {
    deleteArticleBtn[i].addEventListener("click", async function () {
        questionModal("Ви дійсно хочете видалити цю статтю ?", async function() {
            await fetch("/admin/articles/" + deleteArticleBtn[i].getAttribute("id"), {
                method: "DELETE"
            });

            window.location.href = "/admin/articles";
        }, false);
    });
}

if(loadMoreArticlesBtn) {
    loadMoreArticlesBtn.addEventListener("click", async function () {

        if (skip) {
            const api = await fetch("/articles/articles?count=10&skip=" + skip);
            const response = await api.json();

            for (let i = 0; i < response.length; i++) {
                wrapperArticles.appendChild(createArticleItem(response[i].name, response[i].theme, response[i].authors, response[i].created_at, response[i].filename, true));
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


