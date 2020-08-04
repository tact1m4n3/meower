const API_URL = "https://5.2.255.164:25567/mews";

const form = document.querySelector('form');
const loadingElement = document.querySelector('.loading');
const errorElement = document.querySelector('.error');
const mewsElement = document.querySelector('.mews');
const moreButton = document.querySelector('.show-more');

var cur_offset = 0;
var limit = 10;

loadingElement.style.display = "none";
listAllMews();

try {
    moreButton.addEventListener('click', (event) => {
        cur_offset += limit;
        listAllMews(false);
    });
} catch (error) {
    
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name_obj = form.querySelector("#name");
    const content_obj = form.querySelector("#content");
    const name = name_obj.value;
    const content = content_obj.value;
    name_obj.value = "";
    content_obj.value = "";
    
    if (name === "" || content === "") {
        errorElement.innerHTML = "You need to fill both inputs";
        return;
    }

    const mew = {
        name,
        content
    }
    console.log(mew);
    loadingElement.style.display = "";
    form.style.display = "none";
    fetch(API_URL, {
        method: "post",
        body: JSON.stringify(mew)
    }).then(response => {
        if (!response.ok) {
            response.text().then(text => errorElement.innerHTML = text)
        } else {
            listAllMews()
            loadingElement.style.display = "none";
            form.style.display = "";
        }
    });
});

function listAllMews(reset=true) {
    if (reset) {
        cur_offset = 0;
        mewsElement.innerHTML = "";
    }
    loadingElement.style.display = "";
    fetch(`${API_URL}?offset=${cur_offset}&limit=${limit}`, {"method": "GET"})
        .then(response => {
            if (!response.ok) { throw response.text() }
            return response.json()
        })
        .then(result => {
            if (!result.more) {
                moreButton.style.display="none";
            } else {
                moreButton.style.display="";
            }
            result.mews.forEach(mew => {
                const div = document.createElement("div");

                const header = document.createElement("h3");
                header.textContent = mew.name;
                const contents = document.createElement("p");
                contents.textContent = mew.content;

                div.appendChild(header);
                div.appendChild(contents);

                mewsElement.appendChild(div);
            });
        });
    loadingElement.style.display = "none";
}

