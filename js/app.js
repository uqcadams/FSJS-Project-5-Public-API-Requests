// Empty array to store the fetched data;
let employeeData = [];
// Empty HTMLCollection with global scope for cross-functional handling
let employeeHTMLCollection;

// FETCH API CALL
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Query parametres
const baseURL = "https://randomuser.me/api/";
const results = 12;
const query = `?results=${results}&inc=picture,name,email,location,cell,dob&nat=US`;

/**
 * Basic asynchronous fetch request, taking a custom URL and query parametre to customise the returned information. Can be re-used with different data sources for similar results.
 * @param {takes a URL for fetching data from} baseURL
 * @param {takes the parametres of the fetch query} query
 * @returns the dataset requested by the call
 */
const getEmployeeData = async (baseURL, query) => {
  const response = await fetch(baseURL + query);
  const data = await response.json();
  return data;
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// POPULATING THE DOM WITH THE EMPLOYEE DATA
/**
 * Populates the DOM with cards representing each employee fetched from the random user API.
 */
const populateDirectory = () => {
  const gallery = document.querySelector("#gallery");
  // Establishes an index counter for cross referencing HTML profile and position in employee data array;
  let employeeIndex = 0;
  for (let employee of employeeData) {
    let employeeName = `${employee.name.title} ${employee.name.first} ${employee.name.last}`;
    let employeeProfile = `
      <div class="card" data-index="${employeeIndex}">
          <div class="card-img-container">
              <img class="card-img" src="${employee.picture.medium}" alt="Profile picture: ${employeeName}">
          </div>
          <div class="card-info-container">
              <h3 id="name" class="card-name cap">${employeeName}</h3>
              <p class="card-text">${employee.email}</p>
              <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
          </div>
      </div>
    `;
    // Inserts the employee profile into the DOM
    gallery.insertAdjacentHTML("beforeend", employeeProfile);
    // Increases the index counter for each employee.
    employeeIndex++;
  }
  // Creates an HTML collection of employee cards for manipulation via the search function.
  employeeHTMLCollection = document.getElementsByClassName("card");
  galleryEventListeners();
  appendSearch();
};

const galleryEventListeners = () => {
  for (let employee of employeeHTMLCollection) {
    employee.addEventListener("click", () => {
      let employeeIndex = employee.dataset.index;
      employeeModal(employeeIndex);
    });
  }
};

/**
 * Injects the HTML and data for a custom user profile popup.
 * @param {an integer representing the current index of the user selected} index
 */
const employeeModal = (index) => {
  const employee = employeeData[index];
  const employeeName = `${employee.name.title} ${employee.name.first} ${employee.name.last}`;
  const employeeBirthdate = new Date(employee.dob.date);

  const modal = `
    <div class="modal-container">
      <div class="modal">
          <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
          <div class="modal-info-container">
              <img class="modal-img" src="${employee.picture.medium}" alt="Profile picture: ${employeeName}">
              <h3 id="name" class="modal-name cap">${employeeName}</h3>
              <p class="modal-text">${employee.email}</p>
              <p class="modal-text cap">${employee.location.city}</p>
              <hr>
              <p class="modal-text">${employee.cell}</p>
              <p class="modal-text">${employee.location.street.number} ${employee.location.street.name}, ${employee.location.city}, ${employee.location.state} ${employee.location.postcode}</p>
              <p class="modal-text">Birthday: ${employeeBirthdate.getMonth()}/${employeeBirthdate.getDate()}/${employeeBirthdate.getFullYear()}</p>
          </div>
      </div>

      <div class="modal-btn-container">
          <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
          <button type="button" id="modal-next" class="modal-next btn">Next</button>
      </div>
  </div>
  `;
  document.querySelector("body").insertAdjacentHTML("beforeend", modal);
  modalNavListeners(index);
  closeModal();
};

/**
 * Adds functionality to close the modal pop
 */
const closeModal = () => {
  const closeBtn = document.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", () => {
    document.querySelector(".modal-container").remove();
  });
};

/**
 * Adds event listeners to the navigation buttons on the modal popup. This allows the user to navigate between user profiles.
 * @param {an integer representing the current index of the user selected} index
 */
const modalNavListeners = (index) => {
  let currentIndex = parseInt(index);
  const previousModal = document.querySelector(".modal-prev");
  const nextModal = document.querySelector(".modal-next");

  nextModal.addEventListener("click", () => {
    if (currentIndex < employeeData.length - 1) {
      currentIndex += 1;
    } else {
      currentIndex = 0;
    }
    document.querySelector(".modal-container").remove();
    employeeModal(currentIndex);
  });

  previousModal.addEventListener("click", () => {
    if (currentIndex === 0) {
      currentIndex = employeeData.length - 1;
    } else {
      currentIndex -= 1;
    }
    document.querySelector(".modal-container").remove();
    employeeModal(currentIndex);
  });
};

// EXCEEDS EXPECTATIONS - SEARCH FUNCTIONALITY

// Dynamically inserts searchbar HTML into DOM and applies basic functionality
const appendSearch = () => {
  // Searchbar HTML. Removed the submission button, as the search should provide live results as the user types. The submission button was redundant.
  const searchHTML = `
    <form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
    </form>
  `;

  // Inserts the HTML into the header section
  document.querySelector(".search-container").insertAdjacentHTML("beforeend", searchHTML);

  // Adds a keyup event listener to the search input
  document.getElementById("search-input").addEventListener("keyup", (e) => {
    searchDirectory();
  });
};

/**
 * Search functionality the runs on keypress input in the search bar.
 * Takes user input, and iterates over the HTMLCollection of employee names.
 * If the user input is included in the employee name, the parent card is displayed.
 * If the user input is not included in the employee name, the parent card is hidden.
 */
const searchDirectory = () => {
  let input = document.getElementById("search-input").value;
  input = input.toLowerCase();

  //ITERATE THROUGH THE LIST OF NAMES TO FIND MATCHES
  for (let employee of employeeHTMLCollection) {
    // limits search params to name only
    let employeeName = employee.querySelector(".card-name");
    if (employeeName.textContent.toLowerCase().includes(input)) {
      employee.style.display = "";
    } else {
      employee.style.display = "none";
    }
  }
};

// Fetch function call
getEmployeeData(baseURL, query)
  .then((data) => {
    // stores employee data in the empty array
    employeeData = data.results;
    return employeeData;
  })
  .then(() => {
    // uses the stored data to populate the DOM
    populateDirectory();
  })
  // throws an error with details if an issue arises
  .catch((error) => console.log(`An error occured: ${error}`));
