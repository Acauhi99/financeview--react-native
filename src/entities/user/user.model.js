class User {
  constructor() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.birthDate = "";
    this.password = "";
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

  setBirthDate(birthDate) {
    this.birthDate = birthDate;
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
