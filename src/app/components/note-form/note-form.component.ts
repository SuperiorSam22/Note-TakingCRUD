import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NoteService } from 'src/app/services/note.service';
import { Note } from 'src/app/interfaces/note';

@Component({
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss'],
})
export class NoteFormComponent implements OnInit, OnChanges {
  @Input() selectedNote!: Note;
  noteForm!: FormGroup;
  isEdit!: boolean;

  constructor(
    private noteService: NoteService,
    private formBuilder: FormBuilder
  ) {
    this.noteService.getEditable().subscribe({
      next: (response: boolean) => (this.isEdit = response),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedNote']?.currentValue) {
      const value = changes['selectedNote']?.currentValue;
      this.noteForm.patchValue({
        id: value.id,
        title: value.title,
        content: value.content,
      });
    }
  }

  ngOnInit(): void {
    this.noteForm = this.formBuilder.group({
      id: new Date().getTime(),
      title: ['', Validators.required],
      content: [''],
    });
  }

  onSubmit(): void {
    if (this.noteForm.invalid) {
      return;
    }
    const note: Note = this.noteForm.value;
    if (this.isEdit) {
      this.noteService.updatedNote(note);
      this.noteService.setEditable(false);
    } else {
      this.noteService.createNote(note);
    }
    // this.noteService.getNotesObservable().subscribe((notes: Note[]) => {
    //   console.log(notes);
    // })
    // save it on notes array of service
    this.noteForm.reset();
  }
}
