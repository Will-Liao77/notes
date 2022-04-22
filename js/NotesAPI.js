export default class NotesAPI {
  static getAllNotes() {
    const notes = JSON.parse(localStorage.getItem("NotesApp-notes") || "[]");
    // return notes;

    return notes.sort((a, b) => {
      return new Date(a.updated) > new Date(b.updated) ? -1 : 1;
    });
  }

  static saveNote(NoteToSave) {
    const notes = NotesAPI.getAllNotes();

    const existing = notes.find((note) => note.id == NoteToSave.id);
    if (existing) {
      existing.title = NoteToSave.title;
      existing.body = NoteToSave.body;
      existing.updated = new Date().toISOString();
    } else {
      NoteToSave.id = Math.floor(Math.random() * 100000);
      NoteToSave.updated = new Date().toISOString();
      notes.push(NoteToSave);
    }

    localStorage.setItem("NotesApp-notes", JSON.stringify(notes));
  }

  // delete
  // reference :https://stackoverflow.com/questions/48433435/how-to-delete-an-item-in-list-json-localstorage
  static deleteNote(noteToDelete) {
    const notes = NotesAPI.getAllNotes();
    const existing = notes.find((note) => note.id == noteToDelete);

    if (existing) {
      const index = notes.indexOf(existing);
      // console.log(index);
      notes.splice(index, 1);
      localStorage.setItem("NotesApp-notes", JSON.stringify(notes));
    } else {
      return;
    }
  }
}
