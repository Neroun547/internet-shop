import {questionModal} from "./question-modal.js";

export function createArticleItem(name, theme, authors, date, filename, admin=false) {

    if(admin) {
        const wrapperArticlesItem = document.createElement("div");
        wrapperArticlesItem.classList.add("wrapper__articles-item");

        const wrapperArticlesItemName = document.createElement("div");
        wrapperArticlesItemName.classList.add("wrapper__articles-item-name");

        wrapperArticlesItemName.innerText = "Назва статті: " + name;

        const wrapperArticlesItemTheme = document.createElement("div");
        wrapperArticlesItemTheme.classList.add("wrapper__articles-item-theme");

        wrapperArticlesItemTheme.innerText = "Тема: " + theme;

        const wrapperArticlesItemAuthors = document.createElement("div");
        wrapperArticlesItemAuthors.classList.add("wrapper__articles-item-authors");

        wrapperArticlesItemAuthors.innerText = "Автори: " + authors;

        const wrapperArticlesItemDate = document.createElement("div");
        wrapperArticlesItemDate.classList.add("wrapper__articles-item-date");

        wrapperArticlesItemDate.innerText = "Дата публікації: " + date;

        const articleLink = document.createElement("a");
        articleLink.setAttribute("href", "/admin/articles/edit/" + filename);
        articleLink.classList.add("wrapper__articles-item-edit-link");

        const buttonArticleLink = document.createElement("button");

        buttonArticleLink.innerText = "Редагувати/читати";

        articleLink.appendChild(buttonArticleLink);

        const deleteArticleBtn = document.createElement("button");
        deleteArticleBtn.classList.add("wrapper__articles-item-del-btn");
        deleteArticleBtn.setAttribute("id", filename);
        deleteArticleBtn.innerText = "Видалити статтю";

        deleteArticleBtn.addEventListener("click", function () {
            questionModal("Ви дійсно хочете видалити цю статтю ?", async function() {
                await fetch("/admin/articles/" + deleteArticleBtn[i].getAttribute("id"), {
                    method: "DELETE"
                });

                window.location.href = "/admin/articles";
            }, false);
        });

        wrapperArticlesItem.appendChild(wrapperArticlesItemName);
        wrapperArticlesItem.appendChild(wrapperArticlesItemTheme);
        wrapperArticlesItem.appendChild(wrapperArticlesItemAuthors);
        wrapperArticlesItem.appendChild(wrapperArticlesItemDate);
        wrapperArticlesItem.appendChild(articleLink);
        wrapperArticlesItem.appendChild(deleteArticleBtn);

        return wrapperArticlesItem;
    } else {
        const wrapperArticlesItem = document.createElement("div");
        wrapperArticlesItem.classList.add("wrapper__articles-item");

        const wrapperArticlesItemName = document.createElement("div");
        wrapperArticlesItemName.classList.add("wrapper__articles-item-name");

        wrapperArticlesItemName.innerText = "Назва статті: " + name;

        const wrapperArticlesItemTheme = document.createElement("div");
        wrapperArticlesItemTheme.classList.add("wrapper__articles-item-theme");

        wrapperArticlesItemTheme.innerText = "Тема: " + theme;

        const wrapperArticlesItemAuthors = document.createElement("div");
        wrapperArticlesItemAuthors.classList.add("wrapper__articles-item-authors");

        wrapperArticlesItemAuthors.innerText = "Автори: " + authors;

        const wrapperArticlesItemDate = document.createElement("div");
        wrapperArticlesItemDate.classList.add("wrapper__articles-item-date");

        wrapperArticlesItemDate.innerText = "Дата публікації: " + date;

        const articleLink = document.createElement("a");
        articleLink.setAttribute("href", "/articles/" + filename);
        articleLink.classList.add("wrapper__articles-item-read-article-link");

        const buttonArticleLink = document.createElement("button");

        buttonArticleLink.innerText = "Читати статтю";

        articleLink.appendChild(buttonArticleLink);

        wrapperArticlesItem.appendChild(wrapperArticlesItemName);
        wrapperArticlesItem.appendChild(wrapperArticlesItemTheme);
        wrapperArticlesItem.appendChild(wrapperArticlesItemAuthors);
        wrapperArticlesItem.appendChild(wrapperArticlesItemDate);
        wrapperArticlesItem.appendChild(articleLink);

        return wrapperArticlesItem;
    }
}

