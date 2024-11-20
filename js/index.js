document.addEventListener("DOMContentLoaded", function () {
    const emailList = document.querySelector(".email-items");
    const emailDetailPanel = document.querySelector(".email-detail-panel");
    const emailSubjectLarge = emailDetailPanel.querySelector(".email-subject-large");
    const emailDateLarge = emailDetailPanel.querySelector(".email-date-large");
    const emailBodyLarge = emailDetailPanel.querySelector(".email-body-large");
    const emailAvatarLarge = emailDetailPanel.querySelector(".email-avatar-large");
    const favoriteButton = emailDetailPanel.querySelector(".favorite-button");
    const filterButtons = document.querySelectorAll(".filter-button");
    const prevButton = document.querySelector(".prev-button");
    const nextButton = document.querySelector(".next-button");
    const pageInfo = document.querySelector(".page-info");

    let currentlySelectedEmail = null;
    let emailsData = [];
    let unreadEmails = [];
    let readEmails = [];
    let favoriteEmails = [];
    let currentPage = 1;

    // Fetch email data for the current page
    function fetchEmails(page) {
        const url = `https://flipkart-email-mock.vercel.app/?page=${page}`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                emailsData = data.list; // Load emails from the current page
                unreadEmails = emailsData.filter(email => !email.read);
                renderEmails(unreadEmails);
                updatePaginationControls();
            })
            .catch(error => console.error('Error fetching email data:', error));
    }

   // Function to render emails
function renderEmails(emails) {
    emailList.innerHTML = ''; // Clear existing emails

    if (emails.length === 0) {
        // Show a message if no emails match the filter
        const noEmailsMessage = document.createElement('p');
        noEmailsMessage.classList.add('no-emails-message');
        const activeFilter = document.querySelector(".filter-button.active");

        if (activeFilter.classList.contains("read")) {
            noEmailsMessage.textContent = "There are no read emails.";
        } else if (activeFilter.classList.contains("favourite")) {
            noEmailsMessage.textContent = "You don't have any favorite emails.";
        } else if (activeFilter.classList.contains("unread")) {
            noEmailsMessage.textContent = "There are no unread emails.";
        } else {
            noEmailsMessage.textContent = "No emails to display.";
        }

        emailList.appendChild(noEmailsMessage);
        return; // Exit the function since there's nothing to render
    }

    // Render email items if emails are available
    emails.forEach(email => {
        const emailItem = createEmailItem(email);
        emailList.appendChild(emailItem);
    });
}


    // Function to create a single email item
    function createEmailItem(email) {
        const emailItem = document.createElement('div');
        emailItem.classList.add('email-item');
        emailItem.dataset.id = email.id;
    
        // Apply the unread-email class if the email is unread
        if (!email.read) {
            emailItem.classList.add('unread-email');
        }
    
        emailItem.innerHTML = `
            <div class="email-avatar">${email.from.name[0]}</div>
            <div class="email-details">
                <p class="email-from">From: ${email.from.name} &lt;${email.from.email}&gt;</p>
                <p class="email-subject">Subject: ${email.subject}</p>
                <p class="email-body">${email.short_description}</p>
                <p class="email-date">${new Date(email.date).toLocaleString()}</p>
                ${email.favorite ? '<span class="email-favorite">Favorite</span>' : ''}
            </div>
        `;
    
        emailItem.addEventListener('click', function () {
            if (currentlySelectedEmail === emailItem) {
                emailDetailPanel.classList.remove('visible');
                currentlySelectedEmail = null;
            } else {
                email.read = true; // Mark email as read
                emailItem.classList.remove('unread-email'); // Remove unread styling
                updateEmailSections(email); // Update email sections
    
                emailDetailPanel.classList.add('visible');
                emailSubjectLarge.textContent = email.subject;
                emailDateLarge.textContent = new Date(email.date).toLocaleString();
                emailBodyLarge.textContent = email.short_description;
                emailAvatarLarge.textContent = email.from.name[0];
    
                favoriteButton.textContent = email.favorite ? 'Unmark as Favorite' : 'Mark as Favorite';
    
                favoriteButton.onclick = function (event) {
                    event.stopPropagation(); // Prevent event from bubbling to the parent
                
                    // Toggle favorite status
                    email.favorite = !email.favorite;
                
                    // Update favorite button text
                    favoriteButton.textContent = email.favorite ? 'Unmark as Favorite' : 'Mark as Favorite';
                
                    // Remove or re-add the email to the favoriteEmails list
                    updateEmailSections(email); 
                
                    // Re-render the emails based on the active filter and current page
                    renderEmails(getCurrentFilterEmails(), currentPage);
                };
                
    
                currentlySelectedEmail = emailItem;
            }
        });
    
        return emailItem;
    }
    

    // Update email categories
    function updateEmailSections(email) {
        if (email.read) {
            unreadEmails = unreadEmails.filter(e => e.id !== email.id);
            if (!readEmails.find(e => e.id === email.id)) {
                readEmails.push(email);
            }
        }
        if (email.favorite) {
            if (!favoriteEmails.find(e => e.id === email.id)) {
                favoriteEmails.push(email);
            }
        } else {
            favoriteEmails = favoriteEmails.filter(e => e.id !== email.id);
        }
    }

    // Get the current filter's emails
    function getCurrentFilterEmails() {
        const activeFilter = document.querySelector(".filter-button.active");
        if (activeFilter.classList.contains("unread")) {
            return unreadEmails;
        } else if (activeFilter.classList.contains("read")) {
            return readEmails;
        } else if (activeFilter.classList.contains("favourite")) {
            return favoriteEmails;
        }
        return emailsData; // Default to all emails if no filter is active
    }

    // Update pagination controls
    function updatePaginationControls() {
        pageInfo.textContent = `Page ${currentPage}`;
        prevButton.disabled = currentPage === 1;

        prevButton.onclick = function () {
            if (currentPage > 1) {
                currentPage--;
                fetchEmails(currentPage);
            }
        };

        nextButton.onclick = function () {
            currentPage++;
            fetchEmails(currentPage);
        };
    }

    // Handle filter button clicks
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            renderEmails(getCurrentFilterEmails());
        });
    });

    // Start by fetching the first page
    fetchEmails(currentPage);
});
