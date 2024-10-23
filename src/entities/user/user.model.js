class User {
  constructor() {
    this.id = null;
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.dob = "";
    this.password = "";
  }

  setId(id) {
    this.id = id;
    return this;
  }

  setFirstName(firstName) {
    this.firstName = firstName;
    return this;
  }

  setLastName(lastName) {
    this.lastName = lastName;
    return this;
  }

  setEmail(email) {
    this.email = email;
    return this;
  }

  setDob(dob) {
    this.dob = dob;
    return this;
  }

  setPassword(password) {
    this.password = password;
    return this;
  }

  build() {
    return this;
  }
}

export default User;
