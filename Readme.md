# Email Client App

-[Live](https://email-client-frontend.netlify.app)

This project is an email client application inspired by Outlook, developed using vanilla CSS, HTML, and JavaScript. The app features an intuitive UI for viewing, filtering, and managing emails.

## Features

- **Email List View**: Displays a list of emails with essential information such as the sender, subject, short description, and date/time.
- **Email Body View**: When an email is clicked, the application splits into a master-slave view. The left side shows the email list, while the right side displays the email body, which is fetched on demand.
- **Mark as Favorite**: Users can mark any email as favorite by clicking the "Mark as Favorite" button in the email body section.
- **Read and Unread Mails**: The app distinguishes between read and unread emails using different CSS styles.
- **Email Filtering**: Users can filter emails by favorites, read, and unread status.
- **Pagination**: Supports pagination for the email list.
- **Persistent Storage**: Favorited and read emails are persisted across sessions using local storage.

## API Endpoints

The following APIs are used to fetch emails:

- **Get All Emails**: 
  - [Emails List API](https://flipkart-email-mock.now.sh/)
  - Paginated: `https://flipkart-email-mock.now.sh/?page=<pageNumber>`

- **Get Email Body**: 
  - `https://flipkart-email-mock.now.sh/?id=<email-item-id>`

## UI Design References

- [Sample UI Email List View](http://bit.ly/2VtQGcb)
- [Email Body View](http://bit.ly/2I5DemI)
- [Color Codes](http://bit.ly/2wa2pCa)

## Implementation Details

- **Email Rendering**: Each email displays the sender's avatar (first character of the sender's first name), subject, short description, and timestamp formatted as `dd/MM/yyyy hh:mm a`.
- **Semantic HTML**: The layout avoids using div soup, leveraging semantic HTML tags for improved accessibility and SEO.
- **Media Queries**: The application is responsive, with styles adapted for various screen sizes.

