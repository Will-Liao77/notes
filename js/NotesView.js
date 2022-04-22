export default class NotesView {
  constructor(
    root,
    { onNoteSelect, onNoteAdd, onNoteEdit, onNoteDelete } = {}
  ) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;

    this.root.innerHTML = `
    <div class="notes_sidebar">
        <ul class="nav nav-pills">
          <li class="nav-item" data-type="all">
            <a class="nav-link active "href="#">All notes</a>
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

    filters.forEach((tab) => {
      tab.addEventListener("click", function (e) {
        e.preventDefault();
        const tabType = this.getAttribute("data-type");
        document.querySelectorAll(".nav-link").forEach((nav) => {
          nav.classList.remove("active");
        });
        this.firstElementChild.classList.add("active");
        // getItemsFilter(tabType);
        document.querySelector("#tabValue").value = tabType;
      });
    });

    // const getItemsFilter = function (type) {
    //   let filtersItems = [];
    //   switch (type) {
    //     case "todo":
    //       // filtersItems =
    //       break;
    //     case "done":
    //       break;
    //     case "delete":
    //       break;
    //     default:
    //       break;
    //   }
    // };

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

  _CreateListItemHTML(id, title, body, updated) {
    const MAX_BODY_LENGTH = 60;

    return `
  <div class="card" style="width: 26rem" data-note-id="${id}">
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
            <option selected>None</option>
            <option value="processing">processing</option>
            <option value="done">done</option>
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
        note.id,
        note.title,
        note.body,
        new Date(note.updated)
      );

      NotesListContainer.insertAdjacentHTML("beforeend", html);
    }

    // let saveID;
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

    this.root.querySelectorAll(".form-select").forEach((select) => {
      select.addEventListener("change", () => {
        // console.log(select.parentElement.parentElement);
        switch (select.value) {
          case "processing":
            // console.log("processing");
            select.parentElement.parentElement.classList.remove("done");
            select.parentElement.parentElement.classList.remove("none");
            select.parentElement.parentElement.classList.add("processing");
            break;
          case "done":
            // console.log("done");
            select.parentElement.parentElement.classList.remove("processing");
            select.parentElement.parentElement.classList.remove("none");
            select.parentElement.parentElement.classList.add("done");
            break;
          default:
            console.log("None");
            break;
        }
      });
    });

    // selectBox.value = "done";
    // console.log(note.title);
    // console.log(this.root.querySelectorAll(".card_list"));

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
