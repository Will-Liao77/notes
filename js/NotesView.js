export default class NotesView {
  constructor(root, { onNoteSelect, onNoteAdd, onNoteEdit } = {}) {
    this.root = root;
    this.onNoteSelect = onNoteSelect;
    this.onNoteAdd = onNoteAdd;
    this.onNoteEdit = onNoteEdit;

    this.root.innerHTML = `
    <div class="notes_sidebar">
        <ul class="nav nav-pills">
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="#"
              >All notes</a
            >
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#">Link</a>
          </li>
          <li class="nav-item">
            <a class="nav-link disabled">Disabled</a>
          </li>
          <li class="nav-item">
            <button class="btn btn-success notes_Add" type="button">
              Add notes
            </button>
          </li>
        </ul>

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
          <div class="card_updated">
              ${updated.toLocaleString(undefined, {
                dateStyle: "full",
                timeStyle: "short",
              })}
          </div>
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

    // NotesListContainer.querySelector(".card")
    //   .querySelectorAll(".card-body")
    //   .forEach((NoteListItem) => {
    //     NoteListItem.addEventListener("click", () => {
    //       // console.log(NoteListItem.parentElement.getAttribute("data-note-id"));
    //       // console.log(NoteListItem.parentElement.dataset.noteId);
    //       this.onNoteSelect(NoteListItem.parentElement.dataset.noteId);
    //     });
    //   });

    NotesListContainer.querySelectorAll(".card").forEach((NoteListItem) => {
      NoteListItem.addEventListener("click", () => {
        this.onNoteSelect(NoteListItem.dataset.noteId);
      });
    });
  }

  UpdateActiveNote(note) {
    this.root.querySelector(".notes_title").value = note.title;
    this.root.querySelector(".notes_body").value = note.body;
    // console.log(note.title);
    // console.log(this.root.querySelectorAll(".card_list"));

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