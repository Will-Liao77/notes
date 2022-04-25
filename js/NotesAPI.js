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
      existing.nowStatus = NoteToSave.nowStatus;
      // console.log(NoteToSave.status);
      existing.updated = new Date().toISOString();
    } else {
      NoteToSave.id = Math.floor(Math.random() * 100000);
      NoteToSave.nowStatus = 0;
      NoteToSave.updated = new Date().toISOString();
      notes.push(NoteToSave);
    }
    localStorage.setItem("NotesApp-notes", JSON.stringify(notes));
  }

  static tabChange(tab) {
    const notes = NotesAPI.getAllNotes();
    let filterItems = [];
    switch (tab) {
      case "all":
        filterItems = notes.filter((item) => {
          return true;
        });
        break;
      case "todo":
        filterItems = notes.filter((item) => {
          if (
            item.nowStatus == 1 &&
            item.nowStatus != 0 &&
            item.nowStatus != 2 &&
            item.nowStatus != 3
          ) {
            return true;
          } else {
            return false;
          }
        });
        break;
      case "done":
        filterItems = notes.filter((item) => {
          if (
            item.nowStatus == 2 &&
            item.nowStatus != 0 &&
            item.nowStatus != 1 &&
            item.nowStatus != 3
          ) {
            return true;
          } else {
            return false;
          }
        });
        break;
      case "delete":
        filterItems = notes.filter((item) => {
          if (
            item.nowStatus == 3 &&
            item.nowStatus != 0 &&
            item.nowStatus != 1 &&
            item.nowStatus != 2
          ) {
            return true;
          } else {
            return false;
          }
        });
        break;
      default:
        filterItems = notes;
        break;
    }
    return filterItems;
    // console.log(filterItems);
  }

  // delete
  // reference :https://stackoverflow.com/questions/48433435/how-to-delete-an-item-in-list-json-localstorage
  // status defaule: 0, processing: 1, done: 2, deleted: 3
  static deleteNote(noteToDelete) {
    const notes = NotesAPI.getAllNotes();
    const existing = notes.find((note) => note.id == noteToDelete);
    let filterDeleteItems = [];

    if (existing && existing.nowStatus == 3) {
      const index = notes.indexOf(existing);
      // console.log(index);
      notes.splice(index, 1);
      localStorage.setItem("NotesApp-notes", JSON.stringify(notes));
    } else {
      existing.title = existing.title;
      existing.body = existing.body;
      existing.nowStatus = 3;
      existing.updated = new Date().toISOString();
      localStorage.setItem("NotesApp-notes", JSON.stringify(notes));
    }

    filterDeleteItems = notes.filter((deleteItem) => {
      if (deleteItem.nowStatus == 3) {
        return false;
      } else {
        return true;
      }
    });
    // console.log(filterDeleteItems);
    return filterDeleteItems;
  }
}
