# opper_hack

```
type Query {
  users(id: String): [User!]
  resources(name: String): [Resource]
  colleges(name: String): [School]
  highSchools(name: String): [School]
}

type Mutation {
  addUser(firstName: String, lastName: String, email: String, inCollege: Boolean, address: String, major: String): Query
  addResources(names: [String!]!, links: [String!]!): Query
  addUserSchool(userID: String, schoolName: String): Query
  addSchool(name: String, type: SchoolType, registrationDeadline: String): Query
  addSchoolEvent(schoolName: String, link: String, name: String, description: String, deadline: String): Query
}

type User {
  id: String

  name: Name
  age: Int
  email: String

  "This is the current level of school this person is in"
  schoolState: SchoolType

  "The address of this person"
  address: String

  "The major of this person in school"
  major: String

  "The desired major of this person"
  desiredMajor: String
  highSchool: School
  middleSchool: School
  college: School
}

type Name {
  formal: String
  informal: String
}

enum SchoolType {
  COLLEGE
  HIGH_SCHOOL
  MIDDLE_SCHOOL
  OTHER
}

type School {
  name: Name
  type: SchoolType

  events: [Event]
  registrationDeadline: String
}

type Resource {
  name: String
  link: String
}

type Event {
  link: String
  name: Name
  description: String
  deadline: String
}
```
