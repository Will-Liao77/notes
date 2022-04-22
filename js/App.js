import NotesAPI from "./NotesAPI.js";
import NotesView from "./NotesView.js";

export default class App {
  constructor(root) {
    this.notes = [];
    this.activeNote = null;
    this.view = new NotesView(root, this._handlers());
    this._refreshNotes();
  }

  _refreshNotes() {
    const notes = NotesAPI.getAllNotes();
    this._setNotes(notes);
    if (notes.length > 0) {
      this._setActiveNote(notes[0]);
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
          id: this.activeNote.id,
          title,
          body,
        });
        this._refreshNotes();
      },
      onNoteDelete: (noteId) => {
        NotesAPI.deleteNote(noteId);
        this._refreshNotes();
        this._handlers();
      },
    };
  }
}
