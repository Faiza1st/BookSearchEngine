// queries.js
//  `GET_ME` -> execute the me query 
import { gql } from '@apollo/client';

export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      savedBooks {
        bookId
        image
        authors
        description
        link
        title
      }
    }
  }
`;
