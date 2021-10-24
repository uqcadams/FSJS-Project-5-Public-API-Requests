# FSJS-Project-5-Public-API-Requests

Full Stack JavaScript Project 5 - Public API Requests

1. I removed the search submission button from the DOM. The directory filtering is realtime, and updates on keyboard input. The submission button was made redundant by this approach to the implementation.

2. I implemented a darker theme, changing the background colour to a dark shade, and changing the title a treehouse-style green for contrast.

3. I updated the font for the directory to use Zen Kurenaido. It's nice.

4. I squared off the borders on the user images. The shapes collectively feel a little more consistent.

Exceeds expectations have been met with the implementation of the custom search function and the modal toggle.

Search: This uses a keyup event handler, and matches user input against the textContent of the name contained on the employee card. At first this was designed to work with all text (including location), but I limited this at the end to make sure I
met the instructions in the assessment brief.

Modal toggle: navigation is achieved by dynamically assigning an index reference (as a data caption) when populating the dom. The navigation buttons capture this index reference, and then cycle through the stored data array.

Thanks, love you!
