import { Injectable } from '@angular/core';
import { defer, share, ReplaySubject, firstValueFrom } from 'rxjs';
import { Quill, QuillType } from './quill';

// For lazy-loading CSS
// "defer" allows you to create an Observable only when the Observer subscribes. It waits until an Observer subscribes to it.
const quillCSS$ = defer(() =>
                  import('!!raw-loader!quill/dist/quill.snow.css').then((m) => {
                    const style = document.createElement('style');
                    style.id = 'quill_style'; 
                    style.innerHTML = m.default;
                    document.head.appendChild(style);
                  })
                  ).pipe(
                        share({
                          connector: () => new ReplaySubject(1),
                          resetOnComplete: false,
                          resetOnError: false,
                          resetOnRefCountZero: false
                        })
                  );  

@Injectable()
export class QuillService {

  // Quill component
  quill : QuillType | null = null;

  constructor() { }

  // For lazy-loading CSS
  // "firstValueFrom" converts an observable to a promise by subscribing to the observable, 
  // and returning a promise that will resolve as soon as the first value arrives from the observable.
  beforeRender = () => firstValueFrom(quillCSS$); 

  // Creating a Quill component for editing
  createQuill(container: string) {
    this.quill = new Quill(container, {
      modules: {
        toolbar: [
            [{ header: [1, 2, 3, false] }],    
            ['bold', 'italic', 'underline'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ]
      },
      placeholder: 'Write a book review here...',
      theme: 'snow'
    });    
  }

  // Creating a Quill component for browsing
  createQuillForBrowse(container: string) {
    this.quill = new Quill(container, {
      modules: {
        toolbar: false
      },
      readOnly: true,  
      theme: 'snow'
    });    
  }

  // Getting the text version of Quill content without tags and control characters
  getContentText(text: string) : string {
   
    const imageStartTag = '{"image":"data:image';
    const imageEndTag = '"}';       
    while (text.includes(imageStartTag))
    {
        const imageStartIndex = text.indexOf(imageStartTag);
        const imageEndIndex = text.indexOf(imageEndTag, imageStartIndex + imageStartTag.length);
        text = text.slice(imageStartIndex, imageEndIndex + imageEndTag.length - imageStartIndex);
    }

    // Removes other tags
    text = text.replace(/{"ops":\[\{/g, '').replace(/"insert":/g, '');
    text = text.replace(/{"attributes":/g, '');        
    text = text.replace(/{"header":1},/g, '').replace(/{"header":2},/g, '').replace(/{"header":3},/g, '');       
    text = text.replace(/{"header":1}/g, '').replace(/{"header":2}/g, '').replace(/{"header":3}/g, '');  
    text = text.replace(/{"list":"bullet"},/g, '').replace(/{"list":"ordered"},/g, '');
    text = text.replace(/{"list":"bullet"}/g, '').replace(/{"list":"ordered"}/g, '');
    text = text.replace(/{"underline":true,/g, '').replace(/{"underline":true/g, '');
    text = text.replace(/{"italic":true,/g, '').replace(/{"bold":true,/g, '');     
    text = text.replace(/{"code-block":true,/g, '').replace(/{"blockquote":true,/g, '');   
    text = text.replace(/{"italic":true/g, '').replace(/{"bold":true/g, '');     
    text = text.replace(/{"code-block":true/g, '').replace(/{"blockquote":true/g, '');;  
    text = text.replace(/"italic":true,/g, '').replace(/"bold":true,/g, '');     
    text = text.replace(/"code-block":true,/g, '').replace(/"blockquote":true,/g, '');   
    text = text.replace(/,{"/g, '').replace(/"},/g, '');
    text = text.replace(/{"/g, '').replace(/"}/g, '');
    text = text.replace(/,"/g,'').replace(/,{/g, '').replace(/},/g, '');
    text = text.replace(/"italic":true/g, '').replace(/"bold":true/g, '');     
    text = text.replace(/"code-block":true/g, '').replace(/"blockquote":true/g, '');;                           
    text = text.replace(/\[/g, '').replace(/\]/g, '').replace(/\\n/g, '');
    text = text.replace(/\:/g, '').replace(/{/g, '').replace(/}/g, '');
    text = text.replace(/"/g, '');

    return text.trim();
  }  

  // Checking if the content is empty or not
  isContentValid() {
    let isValid : boolean = true;

    if (this.quill === null) {
      isValid = false;
    } else {
      const text = this.quill.getText().replace("\\n", "").trim();
      if (text.length == 0){
          isValid = false;
          alert('There is no review to save.');
      }
    }

    return isValid;
  }
}
