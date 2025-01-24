import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Contact } from './models/contact.model';
import { ContactService } from './services/contact.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AsyncPipe, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  contactForm = new FormGroup({
    name: new FormControl<string>(''),
    email: new FormControl<string | null>(null),
    phone: new FormControl<string>(''),
    favorite: new FormControl<boolean>(false)
  });

  contacts$: Observable<Contact[]>;

  constructor(private contactService: ContactService) {
    this.contacts$ = this.contactService.getContacts();
  }

  onFormSubmit() {
    const addContactRequest: Partial<Contact> = {
      name: this.contactForm.value.name as string,
      email: this.contactForm.value.email as string,
      phone: this.contactForm.value.phone as string,
      favorite: this.contactForm.value.favorite as boolean
    };

    this.contactService.addContact(addContactRequest).subscribe({
      next: (value) => {
        console.log(value);
        this.contacts$ = this.contactService.getContacts();
        this.contactForm.reset();
      }
    });
  }

  onDelete(id: string) {
    this.contactService.deleteContact(id).subscribe({
      next: () => {
        alert('Item Deleted');
        this.contacts$ = this.contactService.getContacts(); 
      },
      error: (err) => {
        console.error('Error deleting contact', err);
        alert('Failed to delete the item');
      }
    });
  }
}
