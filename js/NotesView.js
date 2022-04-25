export default class NotesView {
  constructor(
    root,
    {
      onNoteSelect,
      onNoteAdd,
      onNoteEdit,
      onNoteDelete,
      onStatusChange,
      onTabChange,
    } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;
    this.onStatusChange = onStatusChange;
    this.onTabChange = onTabChange;
    // console.log(this.onTabChange);

    this.root.innerHTML = `
    <div class="notes_sidebar">
        <ul class="nav nav-pills">
          <li class="nav-item" data-type="all">
            <a class="nav-link active " id="firstNavItem" href="#">All notes</a>
          </li>
          <li class="nav-item" data-type="todo">
            <a class="nav-link" href="#">on the way</a>
          </li>
          <li class="nav-item" data-type="done">
            <a class="nav-link" href="#">done</a>
          </li>
          <li class="nav-item" data-type="delete">
            <a class="nav-link" href="#">gone</a>
          </li>
          <li class="nav-item">
            <button class="btn btn-success notes_Add" type="button">
              Add notes
            </button>
          </li>
        </ul>
        <input type="hidden" id="tabValue" value="all" />
        <div class="sidebar_content">
          <div class="card_list"></div>
        </div>
    </div>

    <div class="notes_preview">
        <input type="text" class="notes_title" placeholder="Enter a title..." />
        <textarea class="notes_body">Take Note...</textarea>
    </div>
    `;

    const btn_AddNote = this.root.querySelector(".notes_Add");
    const in_Title = this.root.querySelector(".notes_title");
    const in_Body = this.root.querySelector(".notes_body");
    const filters = this.root.querySelectorAll(".nav-item");

    const NotesView = this;
    filters.forEach((tab) => {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        const tabType = this.getAttribute("data-type");
        document.querySelectorAll(".nav-link").forEach((nav) => {
          nav.classList.remove("active");
        });
        this.firstElementChild.classList.add("active");
        // console.log(this);
        NotesView.onTabChange(tabType);
        // getItemsFilter(tabType);
        // document.querySelector("#tabValue").value = tabType;
      });
    });

    const firstNav = this.root.querySelector("#firstNavItem");
    btn_AddNote.addEventListener("click", () => {
      this.onNoteAdd();
    });

    [in_Title, in_Body].forEach((inputField) => {
      inputField.addEventListener("blur", () => {
        const updatedTitle = in_Title.value.trim();
        const updatedBody = in_Body.value.trim();
        this.onNoteEdit(updatedTitle, updatedBody);
      });
    });

    this.UpdateNotePreviewVisibility(false);
  }
  // status defaule: 0, processing: 1, done: 2, deleted: 3
  _CreateListItemHTML(nowStatus, id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;
    // option 加if 判斷式
    return `
  <div class="card ${nowStatus}" style="width: 26rem" data-note-id="${id}">
      <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">
              ${body.substring(0, MAX_BODY_LENGTH)}
              ${body.length > MAX_BODY_LENGTH ? "..." : ""}
          </p>
          <i class="bi bi-trash3"></i>
          <div class="card_updated">
              ${updated.toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "short",
              })}
          </div>
          <select class="form-select w-25 selectorBox">
            <option value="All" ${
              nowStatus == 0 &&
              nowStatus != 1 &&
              nowStatus != 2 &&
              nowStatus != 3
                ? "selected"
                : "None"
            }>All</option>
            <option value="todo"${
              nowStatus == 1 &&
              nowStatus != 0 &&
              nowStatus != 2 &&
              nowStatus != 3
                ? "selected"
                : "None"
            }>processing</option>
            <option value="done"${
              nowStatus == 2 &&
              nowStatus != 0 &&
              nowStatus != 1 &&
              nowStatus != 3
                ? "selected"
                : "None"
            }>done</option>
            <option value="delete"${
              nowStatus == 3 &&
              nowStatus != 0 &&
              nowStatus != 1 &&
              nowStatus != 2
                ? "selected"
                : "None"
            }>delete</option>
          </select>
      </div>
  </div>
  `;
  }

  UpdateNoteList(notes) {
    const NotesListContainer = this.root.querySelector(".card_list");

    NotesListContainer.innerHTML = "";

    for (const note of notes) {
      const html = this._CreateListItemHTML(
        note.nowStatus,
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );

      NotesListContainer.insertAdjacentHTML("beforeend", html);
    }

    NotesListContainer.querySelectorAll(".card").forEach((NoteListItem) => {
      NoteListItem.addEventListener("click", () => {
        // console.log(NoteListItem.dataset.noteId);
        // console.log(NoteListItem);
        this.onNoteSelect(NoteListItem.dataset.noteId);
        // saveID = NoteListItem.dataset.noteId;
      });
    });
  }

  UpdateActiveNote(note) {
    this.root.querySelector(".notes_title").value = note.title;
    this.root.querySelector(".notes_body").value = note.body;

    // selectBox.value = "done";
    // console.log(note.title);
    // console.log(this.root.querySelectorAll(".card_list"));
    this.root.querySelectorAll(".form-select").forEach((select) => {
      // const preValue = select.value;
      select.addEventListener("change", () => {
        // console.log(select.parentElement.parentElement.dataset.noteId);
        switch (select.value) {
          case "All":
            select.parentElement.parentElement.classList.remove("todo");
            select.parentElement.parentElement.classList.remove("done");
            select.parentElement.parentElement.classList.remove("delete");
            select.parentElement.parentElement.classList.add("All");
            // console.log(preValue);
            this.onStatusChange(0);
            // console.log(select.parentElement.parentElement.dataset.noteId);
            break;
          case "todo":
            // console.log("processing");
            select.parentElement.parentElement.classList.remove("done");
            select.parentElement.parentElement.classList.remove("All");
            select.parentElement.parentElement.classList.remove("delete");
            select.parentElement.parentElement.classList.add("todo");
            // console.log(preValue);
            this.onStatusChange(1);
            // console.log(select.parentElement.parentElement.dataset.noteId);
            break;
          case "done":
            // console.log("done");
            select.parentElement.parentElement.classList.remove("todo");
            select.parentElement.parentElement.classList.remove("All");
            select.parentElement.parentElement.classList.remove("delete");
            select.parentElement.parentElement.classList.remove("done");
            select.parentElement.parentElement.classList.add("done");
            // console.log(preValue);
            this.onStatusChange(2);
            // console.log(select.parentElement.parentElement.dataset.noteId);
            break;
          case "delete":
            // console.log("done");
            select.parentElement.parentElement.classList.remove("todo");
            select.parentElement.parentElement.classList.remove("All");
            select.parentElement.parentElement.classList.remove("done");
            select.parentElement.parentElement.classList.add("delete");
            // console.log(preValue);
            this.onStatusChange(3);
            // console.log(select.parentElement.parentElement.dataset.noteId);
            break;
          default:
            select.parentElement.parentElement.classList.remove("todo");
            select.parentElement.parentElement.classList.remove("done");
            select.parentElement.parentElement.classList.remove("delete");
            select.parentElement.parentElement.classList.add("All");
            this.onStatusChange(0);
            break;
        }
      });
    });

    this.root.querySelectorAll(".card").forEach((NoteListItem) => {
      // console.log(NoteListItem);
      NoteListItem.classList.remove("card--selected");
      NoteListItem.querySelector(".card-body")
        .querySelectorAll(".bi")
        .forEach((btn) => {
          btn.addEventListener("click", () => {
            // console.log(NoteListItem.dataset.noteId);
            this.onNoteDelete(NoteListItem.dataset.noteId);
          });
        });
    });

    this.root
      .querySelector(`.card[data-note-id="${note.id}"]`)
      .classList.add("card--selected");
    // console.log(this.root.querySelector(`.card[data-note-id="${note.id}"]`));
  }

  UpdateNotePreviewVisibility(visible) {
    this.root.querySelector(".notes_preview").style.visibility = visible
      ? "visible"
      : "hidden";
  }
}
