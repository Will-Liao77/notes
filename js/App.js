import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());
    this._refreshNotes();
    // console.log("1");
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();
    this._setNotes(notes);
    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
    }
    document
      .querySelector(".nav-link.active")
      .parentElement.dispatchEvent(new Event("click"));
  }

  _refreshStatus(filters) {
    this._setNotes(filters);
    if (filters.length > 0) {
      this._setActiveNote(filters[0]);
    }
  }

  _setNotes(notes) {
    this.notes = notes;
    this.view.UpdateNoteList(notes);
    this.view.UpdateNotePreviewVisibility(notes.length > 0);
  }

  _setActiveNote(note) {
    this.activeNote = note;
    this.view.UpdateActiveNote(note);
  }

  // status defaule: 0, processing: 1, done: 2, deleted: 3
  _handlers() {
    return {
      onNoteSelect: (noteId) => {
        const selectedNode = this.notes.find((note) => note.id == noteId);
        this._setActiveNote(selectedNode);
      },
      onNoteAdd: () => {
        const newNote = {
          title: "New Note",
          body: "Take Note...",
        };
        NotesAPI.saveNote(newNote);
        this._refreshNotes();
      },
      onNoteEdit: (title, body) => {
        NotesAPI.saveNote({
          nowStatus: this.activeNote.nowStatus,
          id: this.activeNote.id,
          title,
          body,
        });
        // console.log(this.activeNote.nowStatus);
        this._refreshNotes();
      },
      onTabChange: (tabType) => {
        // console.log("hi onTabChange");
        const filterItems = NotesAPI.tabChange(tabType);
        this._refreshStatus(filterItems);
      },
      onStatusChange: (nowStatus) => {
        NotesAPI.saveNote({
          nowStatus,
          id: this.activeNote.id,
          title: this.activeNote.title,
          body: this.activeNote.body,
        });
        // NotesAPI.tabChange(
        //   document.querySelector(".nav-link.active").parentElement.dataset.type
        // );

        this._refreshNotes();
      },

      onNoteDelete: (noteId) => {
        const deleteItems = NotesAPI.deleteNote(noteId);
        this._refreshNotes();
        // this._refreshStatus(deleteItems);
        // this._handlers();
      },
    };
  }
}
