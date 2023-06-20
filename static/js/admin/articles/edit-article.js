const editArticleForm = document.getElementById("edit-article-form");
const filename = editArticleForm.getAttribute("data-filename");

tinymce.init({
    selector: '#textarea',
    height: 800,
    language: 'uk',
});

editArticleForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    await fetch("/admin/articles/edit/" + filename, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: e.target[0].value,
            theme: e.target[1].value,
            authors: e.target[2].value,
            content: e.target[3].value
        })
    });

    window.location.href = "/admin/articles";
});


