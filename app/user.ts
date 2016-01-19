export class User {
  user = { id: '', name: '' };

  constructor() {
      this.user.id = localStorage.getItem('user.id');
      this.user.name = localStorage.getItem('user.name');

    if (!this.user.id) {
        this.user.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = crypto.getRandomValues(new Uint8Array(1))[0] % 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        localStorage.setItem('user.id', this.user.id);
    };

    if (!this.user.name) {
        this.user.name = 'guest';
        localStorage.setItem('user.name', this.user.name);
    };

  }

  getUser(){
    return this.user;
  }
}