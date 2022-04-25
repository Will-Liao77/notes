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

    btn_AddNote.addEventListener("click", () => {
      this.onNoteAdd();
      // document.querySelector(".nav-item").dispatchEvent(new Event("click"));
      setTimeout(() => {
        btn_AddNote.classList.remove("active");
        document.querySelector(".nav-link").classList.add("active");
      }, 100);
      // console.log(document.querySelector(".nav-item"));
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
        this.onNoteSelect(NoteListItem.dataset.noteId);
        // saveID = NoteListItem.dataset.noteId;
      });
    });
    this.root.querySelectorAll(".form-select").forEach((select) => {
      select.addEventListener("change", () => {
        switch (select.value) {
          case "All":
            this.onStatusChange(0);
            break;
          case "todo":
            this.onStatusChange(1);
            break;
          case "done":
            this.onStatusChange(2);
            break;
          case "delete":
            this.onStatusChange(3);
            break;
          default:
            this.onStatusChange(0);
            break;
        }
      });
    });

    this.root.querySelectorAll(".bi").forEach((btn) => {
      btn.addEventListener("click", () => {
        // console.log(NoteListItem.dataset.noteId);
        this.onNoteDelete(btn.parentElement.parentElement.dataset.noteId);
      });
    });
  }

  UpdateActiveNote(note) {
    if (note == undefined) {
      note = { title: "", body: "" };
    }
    this.root.querySelector(".notes_title").value = note.title;
    this.root.querySelector(".notes_body").value = note.body;

    this.root.querySelectorAll(".card").forEach((NoteListItem) => {
      // console.log(NoteListItem);
      NoteListItem.classList.remove("card--selected");
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
