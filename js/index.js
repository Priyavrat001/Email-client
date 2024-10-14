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
    let emailsData = []; // To store the fetched email data
    let unreadEmails = []; // Unread emails
    let readEmails = []; // Read emails
    let favoriteEmails = []; // Favorite emails
    let currentPage = 1;
    const itemsPerPage = 5;

    // Fetch the email data from the API
    fetch('https://flipkart-email-mock.now.sh/')
        .then(response => response.json())
        .then(data => {
            emailsData = data.list; // Store the fetched email data
            unreadEmails = emailsData.filter(email => !email.read);
            renderEmails(unreadEmails, currentPage);
            updatePaginationControls(unreadEmails);
        })
        .catch(error => console.error('Error fetching email data:', error));

    // Function to render emails based on the filter and current page
    function renderEmails(emails, page) {
        emailList.innerHTML = ''; // Clear existing emails
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedEmails = emails.slice(start, end);

        paginatedEmails.forEach(email => {
            const emailItem = createEmailItem(email);
            emailList.appendChild(emailItem);
        });
    }

    // Function to create an email item element
    function createEmailItem(email) {
        const emailItem = document.createElement('div');
        emailItem.classList.add('email-item');
        emailItem.dataset.id = email.id;

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
                updateEmailSections(email); // Update email sections

                emailDetailPanel.classList.add('visible');
                emailSubjectLarge.textContent = email.subject;
                emailDateLarge.textContent = new Date(email.date).toLocaleString();
                emailBodyLarge.textContent = email.short_description;
                emailAvatarLarge.textContent = email.from.name[0];

                favoriteButton.textContent = email.favorite ? 'Unmark as Favorite' : 'Mark as Favorite';

                favoriteButton.onclick = function (event) {
                    event.stopPropagation();
                    email.favorite = !email.favorite;
                    updateEmailSections(email); // Update email sections
                    renderEmails(getCurrentFilterEmails(), currentPage); // Re-render based on the active filter and current page
                };

                currentlySelectedEmail = emailItem;
            }
        });

        return emailItem;
    }

    // Function to update the email sections when an email is read or marked as favorite
    function updateEmailSections(email) {
        // Remove email from unread if marked as read
        if (email.read) {
            unreadEmails = unreadEmails.filter(e => e.id !== email.id);
            if (!readEmails.find(e => e.id === email.id)) {
                readEmails.push(email);
            }
        }

        // Add or remove email from favorites
        if (email.favorite) {
            if (!favoriteEmails.find(e => e.id === email.id)) {
                favoriteEmails.push(email);
            }
        } else {
            favoriteEmails = favoriteEmails.filter(e => e.id !== email.id);
        }
    }

    // Function to return emails based on the current filter
    function getCurrentFilterEmails() {
        const activeFilter = document.querySelector(".filter-button.active");
        if (activeFilter.classList.contains("unread")) {
            return unreadEmails;
        } else if (activeFilter.classList.contains("read")) {
            return readEmails;
        } else if (activeFilter.classList.contains("favourite")) {
            return favoriteEmails;
        }
    }

    // Event listeners for filter buttons
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentPage = 1; // Reset to the first page when filter changes
            renderEmails(getCurrentFilterEmails(), currentPage);
            updatePaginationControls(getCurrentFilterEmails());
        });
    });

    // Function to update pagination controls based on the filtered emails
    function updatePaginationControls(emails) {
        const totalPages = Math.ceil(emails.length / itemsPerPage);
        pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        prevButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === totalPages;

        prevButton.onclick = function () {
            if (currentPage > 1) {
                currentPage--;
                renderEmails(getCurrentFilterEmails(), currentPage);
                updatePaginationControls(getCurrentFilterEmails());
            }
        };

        nextButton.onclick = function () {
            if (currentPage < totalPages) {
                currentPage++;
                renderEmails(getCurrentFilterEmails(), currentPage);
                updatePaginationControls(getCurrentFilterEmails());
            }
        };
    }
});
