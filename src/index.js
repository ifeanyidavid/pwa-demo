let pageIndex = 1;
let articleIndex = 0;

async function fetchRetry(numberOfRetries, url, callback) {
  // Fetch all data and retry if failed
  let error;
  for (let i = 0; i < numberOfRetries; i++) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      return callback(data);
    } catch (err) {
      error = err;
    }
  }
  throw error;
}

async function fetchAllData(index) {
  const url = `https://5e0df4b536b80000143db9ca.mockapi.io/etranzact/v1/article?page=${index}&limit=10`;

  const numberOfRetries = 10;
  return fetchRetry(numberOfRetries, url, renderAllLists);
}

async function fetchCommentById(id) {
  const url = `https://5e0df4b536b80000143db9ca.mockapi.io/etranzact/v1/article/${id}/comments`;

  const numberOfRetries = 10;
  return fetchRetry(numberOfRetries, url, renderComments);
}

async function fetchArticleImagesById(id) {
  const url = `https://5e0df4b536b80000143db9ca.mockapi.io/etranzact/v1/article/${id}/images`;
  const numberOfRetries = 10;
  return fetchRetry(numberOfRetries, url, renderArticleImages);
}

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *client
    body: JSON.stringify(data) // body data type must match "Content-Type" header
  });
  console.log(response);
  if (
    response.status.toString() === "201" ||
    response.status.toString() === "200"
  ) {
    document.getElementById("alert").style.display = "block";
  }
  return await response.json(); // parses JSON response into native JavaScript objects
}

async function postArticle(title, author, avatar, url) {
  const _url = `https://5e0df4b536b80000143db9ca.mockapi.io/etranzact/v1/article`;

  const data = {
    author,
    avatar,
    title,
    url
  };

  const response = await postData(_url, data);
  console.log(response);
}

async function postComment(articleId, comment) {
  const url = `https://5e0df4b536b80000143db9ca.mockapi.io/etranzact/v1/article/${articleId}/comments`;

  const data = {
    articleId: articleId,
    name: "Orlo Nitzsche",
    avatar: "https://s3.amazonaws.com/uifaces/faces/twitter/koridhandy/128.jpg",
    comment: comment
  };

  const response = await postData(url, data);
}

function renderArticleImages(images) {
  const imagesToRender = [];
  for (let i = 0; i < images.length; i++) {
    const html = `
            <img class="carousel__photo initial" src=${images[i].image}>
        `;
    imagesToRender.push(html);
  }

  const carousel = document.getElementById("carousel");
  let carouselWrapper = document.createElement("div");
  carouselWrapper.className = "carousel-wrapper";
  carousel.insertAdjacentElement("beforeend", carouselWrapper);

  const carouselContent = `
    <div class="carousel">
        <div class="carousel__button--next"></div>
        <div class="carousel__button--prev"></div>
    </div>
  `;
  ``;
  document
    .querySelector(".carousel-wrapper")
    .insertAdjacentHTML("beforeend", carouselContent);

  imagesToRender.forEach(image => {
    document.querySelector(".carousel").insertAdjacentHTML("afterbegin", image);
  });
}

function renderAllLists(posts) {
  const postsToRender = [];
  showPagination();
  for (let i = 0; i < posts.length; i++) {
    const html = `
        <div class="card mt-3 post">
        <div class="card-header">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex justify-content-between align-items-center">
                    <div class="mr-2">
                        <img class="rounded-circle" width="45" src=${
                          posts[i].avatar
                        } alt="thumb">
                    </div>
                    <div class="ml-2">
                        <div class="h5 m-0">${
                          posts[i].author ? posts[i].author : "No name"
                        }</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>10 min ago</div>
            <a class="card-link" href=${posts[i].url}>
                <h5 class="card-title">${
                  posts[i].title ? posts[i].title : "No title"
                }</h5>
            </a>
            <a class="card-text" href=/comment/#${posts[i].id}>
                View comments
            </a>
            |
            <a class="card-text" href=/article/#${posts[i].id}>
                View article images
            </a>
        </div>
        </div>
        `;
    postsToRender.push(html);
  }

  const postsWrapper = document.getElementById("posts");
  postsToRender.forEach(el => {
    postsWrapper.innerHTML += el;
  });
}

function showPagination() {
  if (document.getElementById("pagination")) {
    return;
  }
  const wrapper = document.getElementById("app-wrapper");
  const paginationHtml = `
            <div class="d-flex justify-content-between mt-4" id="pagination">
                <button class="btn btn-primary" id="previous">Previous</button>
                <button class="btn btn-primary" id="next">Next</button>
            </div>`;
  wrapper.innerHTML += paginationHtml;
  const nextButton = document.getElementById("next");
  const previousButton = document.getElementById("previous");

  nextButton.addEventListener("click", function() {
    next();
  });

  previousButton.addEventListener("click", function() {
    previous();
  });
}

function handleCommentSubmit(event) {
  event.preventDefault();
  const comment = document.getElementById("addCommentTextArea").value;
  postComment(articleIndex, comment);
  document.getElementById("addCommentTextArea").value = "";
  //   window.location.href = "/";
}

function handleCommentEdit(event) {
  const commentId = event.target.parentNode.id;
  const commentText = document.getElementById(`comment-text-${commentId}`);
  commentText.readOnly = false;
}

function handleCommentDelete(event) {
  console.log("Deleting");
  console.log(event);
  console.log(event.target.parentNode);
}

function renderComments(comments) {
  const commentsToRender = [];
  for (let i = 0; i < comments.length; i++) {
    const html = `
        <div class="card mt-3 comment" id=comment-${comments[i].id}>
            <div class="card-header">
                <div class="d-flex justify-content-between align-items-center card-header-wrapper">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="mr-2">
                            <img class="rounded-circle" width="45" src=${
                              comments[i].avatar
                            } alt="thumb">
                        </div>
                        <div class="ml-2">
                            <div class="h5 m-0">${
                              comments[i].name ? comments[i].name : "No name"
                            }</div>
                        </div>
                    </div>
                    <div class="actions" id=${comments[i].id}></div>
                </div>
            </div>
            <div class="card-body">
                <div class="text-muted h7 mb-2"> <i class="fa fa-clock-o"></i>10 min ago</div>
                <form>
                    <input class="card-text comment-text form-control w-100" type="text" id=comment-text-${
                    comments[i].id
                    } value=${comments[i].comment} required readonly/>
                    <button type="submit" class="btn btn-primary" id="submit-button-${comments[i].id}>Submit</button>
                </form>
            </div>
        </div>
    `;
    commentsToRender.push(html);
  }

  const commentsWrapper = document.getElementById("comments");
  commentsToRender.forEach(el => {
    commentsWrapper.innerHTML += el;
  });

  const editButton = document.createElement("button");
  editButton.classList.add("btn", "btn-primary");
  editButton.onclick = handleCommentEdit;
  editButton.textContent = "Edit";
  const deleteButton = document.createElement("button");
  deleteButton.onclick = handleCommentDelete;
  deleteButton.textContent = "Delete";
  deleteButton.classList.add("btn", "btn-danger", "ml-2");

  [editButton, deleteButton].forEach(element => {
    document.querySelectorAll(".actions").forEach(action => {
      action.appendChild(element);
    });
  });

  let addCommentForm = document.createElement("form");
  addCommentForm.id = "addCommentForm";
  addCommentForm.onsubmit = handleCommentSubmit;
  commentsWrapper.insertAdjacentElement("beforeend", addCommentForm);
  const formContent = `
        <div class="form-group">
            <label for="addCommentTextArea" class="mt-3">Add Comment</label>
            <textarea class="form-control" id="addCommentTextArea" rows="3" required></textarea>
        </div>
        <button class="btn btn-primary" type="submit">Submit</button>
  `;

  document
    .getElementById("addCommentForm")
    .insertAdjacentHTML("beforeend", formContent);
}

function removeAllPosts() {
  const allPosts = document.getElementById("posts");
  while (allPosts.firstChild) {
    allPosts.removeChild(allPosts.firstChild);
  }
}

function removePagination() {
  const pagination = document.getElementById("pagination");
  if (pagination) {
    pagination.remove();
  }
}

function removeComments() {
  const comments = document.getElementById("comments");
  while (comments.firstChild) {
    comments.removeChild(comments.firstChild);
  }
}

function next() {
  pageIndex += 1;
  removeAllPosts();
  fetchAllData(pageIndex);
}

function previous() {
  pageIndex -= 1;
  removeAllPosts();

  if (pageIndex === 0) pageIndex = 1;
  fetchAllData(pageIndex);
}

function getIdFromHash() {
  let theHash = window.location.hash;
  if (theHash.length == 0) {
    theHash = "_index";
  }

  const id = theHash.split("#")[1];
  articleIndex = id;

  return id;
}

function render() {
  const id = getIdFromHash();
  if (
    window.location.pathname === "/comment/" ||
    window.location.pathname === "/"
  ) {
    if (id) {
      removeAllPosts();
      removePagination();
      fetchCommentById(id);
    } else {
      removeComments();
      fetchAllData(1);
    }
  }

  if (window.location.pathname === "/article/") {
    removeAllPosts();
    removePagination();
    removeComments();
    fetchArticleImagesById(id);
  }
}

document.getElementById("alert").style.display = "none";

document.getElementById("create-article-card").style.display = "none";

document
  .getElementById("create-article-button")
  .addEventListener("click", () => {
    if (
      document.getElementById("create-article-card").style.display === "block"
    ) {
      document.getElementById("create-article-card").style.display = "none";
    } else {
      document.getElementById("create-article-card").style.display = "block";
    }
  });

if (document.getElementById("create-article")) {
  document.getElementById("create-article").addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const avatar = document.getElementById("avatar").value;
    const url = document.getElementById("url").value;

    postArticle(title, author, avatar, url);

    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("avatar").value = "";
    document.getElementById("url").value = "";

    document.getElementById("create-article-card").style.display = "none";
  });
}

if (document.getElementById("alert-dismiss")) {
  document.getElementById("alert-dismiss").addEventListener("click", () => {
    if (document.getElementById("alert").style.display === "none") {
      document.getElementById("alert").style.display = "block";
    }

    if (document.getElementById("alert").style.display === "block") {
      document.getElementById("alert").style.display = "none";
    }
  });
}

window.addEventListener("hashchange", function() {
  render();
});

window.addEventListener("DOMContentLoaded", function(ev) {
  render();
});

/* Carousel */

/* window.addEventListener("DOMContentLoaded", function() {
  const d = document;
  // Variables to target our base class,  get carousel items, count how many carousel items there are, set the slide to 0 (which is the number that tells us the frame we're on), and set motion to true which disables interactivity.
  var itemClassName = "carousel__photo";
  console.log(d.getElementsByClassName(itemClassName));

  (items = d.getElementsByClassName(itemClassName)),
    (totalItems = items.length),
    (slide = 0),
    (moving = true);

  // To initialise the carousel we'll want to update the DOM with our own classes
  function setInitialClasses() {
    // Target the last, initial, and next items and give them the relevant class.
    // This assumes there are three or more items.
    items[totalItems - 1].classList.add("prev");
    items[0].classList.add("active");
    items[1].classList.add("next");
  }

  // Set click events to navigation buttons

  function setEventListeners() {
    var next = d.getElementsByClassName("carousel__button--next")[0],
      prev = d.getElementsByClassName("carousel__button--prev")[0];

    next.addEventListener("click", moveNext);
    prev.addEventListener("click", movePrev);
  }

  // Disable interaction by setting 'moving' to true for the same duration as our transition (0.5s = 500ms)
  function disableInteraction() {
    moving = true;

    setTimeout(function() {
      moving = false;
    }, 500);
  }

  function moveCarouselTo(slide) {
    // Check if carousel is moving, if not, allow interaction
    if (!moving) {
      // temporarily disable interactivity
      disableInteraction();

      // Preemptively set variables for the current next and previous slide, as well as the potential next or previous slide.
      var newPrevious = slide - 1,
        newNext = slide + 1,
        oldPrevious = slide - 2,
        oldNext = slide + 2;

      // Test if carousel has more than three items
      if (totalItems - 1 > 3) {
        // Checks if the new potential slide is out of bounds and sets slide numbers
        if (newPrevious <= 0) {
          oldPrevious = totalItems - 1;
        } else if (newNext >= totalItems - 1) {
          oldNext = 0;
        }

        // Check if current slide is at the beginning or end and sets slide numbers
        if (slide === 0) {
          newPrevious = totalItems - 1;
          oldPrevious = totalItems - 2;
          oldNext = slide + 1;
        } else if (slide === totalItems - 1) {
          newPrevious = slide - 1;
          newNext = 0;
          oldNext = 1;
        }

        // Now we've worked out where we are and where we're going, by adding and removing classes, we'll be triggering the carousel's transitions.

        // Based on the current slide, reset to default classes.
        items[oldPrevious].className = itemClassName;
        items[oldNext].className = itemClassName;

        // Add the new classes
        items[newPrevious].className = itemClassName + " prev";
        items[slide].className = itemClassName + " active";
        items[newNext].className = itemClassName + " next";
      }
    }
  }

  // Next navigation handler
  function moveNext() {
    // Check if moving
    if (!moving) {
      // If it's the last slide, reset to 0, else +1
      if (slide === totalItems - 1) {
        slide = 0;
      } else {
        slide++;
      }

      // Move carousel to updated slide
      moveCarouselTo(slide);
    }
  }

  // Previous navigation handler
  function movePrev() {
    // Check if moving
    if (!moving) {
      // If it's the first slide, set as the last slide, else -1
      if (slide === 0) {
        slide = totalItems - 1;
      } else {
        slide--;
      }

      // Move carousel to updated slide
      moveCarouselTo(slide);
    }
  }

  // Initialise carousel
  function initCarousel() {
    setInitialClasses();
    setEventListeners();

    // Set moving to false now that the carousel is ready
    moving = false;
  }

  // make it rain
  initCarousel();
}); */
