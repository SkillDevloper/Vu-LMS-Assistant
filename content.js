// Getting user name Id Or image
function main() {
    // Function to extract user image URL
    function extractImage() {
        const imageElement = document.querySelector(".m-topbar__userpic img");
        const imageUrl = imageElement ? imageElement.src : 'DefaultImage.jpg'; // Default image URL
        chrome.storage.local.set({ imageUrl: imageUrl });
        console.log("User Image URL saved:", imageUrl);
    }

    // Function to extract student name and ID
    function extractData() {
        const element = document.querySelector(".m-nav__link-text");
        if (element) {
            const fullText = element.innerText.trim();
            const nameMatch = fullText.match(/^(.+?)(?=\n|\()/);
            const idMatch = fullText.match(/\((.*?)\)/);

            const studentName = nameMatch ? nameMatch[0].trim() : 'N/A';
            const studentId = idMatch ? idMatch[1].trim() : 'N/A';

            // Save name and ID to chrome.storage.local
            chrome.storage.local.set({
                studentName: studentName,
                studentId: studentId
            });

            console.log("Student Name:", studentName);
            console.log("Student ID:", studentId);
        } else {
            setTimeout(extractData, 1000); // Retry if the element is not found
        }
    }

    // Extract data when the page loads
    window.addEventListener('load', () => {
        extractImage(); // Extract user image
        extractData();  // Extract student name and ID
    });
}

main();






