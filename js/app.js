// FETCH API CALL
// Fetch parametres
// I've positioned these outside the fetch request to make the call more easily reusable with custom calls
const baseURL = "https://randomuser.me/api/";
const results = 12;
const query = `?results=${results}&inc=picture,name,email,location,cell,dob&nat=US`;

// Asynchronous function to fetch data
const getEmployeeData = async (baseURL, query) => {
  const response = await fetch(baseURL + query);
  const data = await response.json();
  return data;
};

// Empty array to store the fetched data;
let employeeData = [];

// Fetch function call
getEmployeeData(baseURL, query)
  .then((data) => {
    // stores employee data in the empty array
    employeeData = data.results;
  })
  // throws an error with details if an issue arises
  .catch((error) => console.log(`An error occured: ${error}`));

const populateDirectory = () => {
  const gallery = document.querySelector("#gallery");
  let directoryHTML = "";
  let employeeIndex = 0;
  for (let employee of employeeData) {
    console.log(employee.email);
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
    directoryHTML += employeeProfile;
    employeeIndex++;
  }
  gallery.innerHTML = directoryHTML;
};

const closeModal = () => {
  const closeBtn = document.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", () => {
    document.querySelector(".modal-container").remove();
  });
  testEvent();
};

const modalNavListeners = (index) => {
  let currentIndex = index;
  const previousModal = document.querySelector(".modal-prev");
  const nextModal = document.querySelector(".modal-next");

  nextModal.addEventListener("click", () => {
    if (currentIndex < employeeData.length) {
      currentIndex += 1;
    } else if (currentIndex === employeeData.length) {
      currentIndex = 0;
    }
    employeeModal(currentIndex);
    console.log(currentIndex);
  });

  previousModal.addEventListener("click", () => {
    if (currentModalIndex === 0) {
      currentModalIndex = 11;
    } else if (currentModalIndex <= 11) {
      currentModalIndex -= 1;
    }
    employeeModal(currentModalIndex);
    console.log(currentModalIndex);
  });
};

const employeeModal = (index) => {
  const currentIndex = index;
  const body = document.querySelector("body");
  const employee = employeeData[currentIndex];
  const employeeName = `${employee.name.title} ${employee.name.first} ${employee.name.last}`;

  const employeeBirthdate = new Date(employee.dob.date);

  console.log(employee);

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
  body.innerHTML += modal;
  modalNavListeners(currentIndex);
  closeModal();
};

const testEvent = () => {
  const employeeThumbs = document.querySelectorAll(".card");
  for (let thumb of employeeThumbs) {
    thumb.addEventListener("click", () => {
      console.log("fired");
      let employeeIndex = thumb.dataset.index;
      employeeModal(employeeIndex);
    });
  }
};
