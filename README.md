# NextJS Instagram Clone

An implementation of Instagram utilizing NextJS - a React framework.

Live Demonstration: https://cyanchill-instagram.herokuapp.com/

## Project Info

More about the project can be found at: https://www.theodinproject.com/paths/full-stack-javascript/courses/javascript/lessons/javascript-final-project

## Internal Documentation:

### User Input Constraints

| Category | Input Type  | Min Length | Max Length | Others Constraints                              |
| -------- | ----------- | ---------- | ---------- | ----------------------------------------------- |
| Profile  | Name        | 3          | 30         | Only letters, numbers, underscores, and periods |
|          | Username    | 3          | 30         | Only letters, numbers, underscores, and periods |
|          | Bio         | -          | 200        | Can't start & end with whitespace               |
| Account  | Password    | 6          | -          | Can't start & end with whitespace               |
| Post     | Description | -          | 200        | Can't start & end with whitespace               |
|          | Comment     | -          | 200        | Can't start & end with whitespace               |
| Messages | Message     | -          | 200        | Can't start & end with whitespace               |
| Images   | Image       | -          | 5MB        | -                                               |
