// grabs user-inputs
document.getElementById("apply-filters").addEventListener("click", () => {
  const state = document.getElementById("state").value;
  const lsat = document.getElementById("lsat").value;
  const gpa = document.getElementById("gpa").value;

  // Build query parameters
  const params = new URLSearchParams({
    state: state || "",
    lsat: lsat || "",
    gpa: gpa || "",
  });

  // Fetch filtered data from Flask API
  fetch(`/api/schools?${params}`)
    .then((response) => response.json())
    .then((data) => {
      const container = document.getElementById("schools-container");
      container.innerHTML = ""; // Clear existing cards

      // Generate new cards from data
      data.forEach((school) => {
        let tuitionInfo = ""; // Creates tuition info variable to represent both Instate and OOS tuition

        // Format the tuition prices with commas
        const tuitionFormatted = school.tuition.toLocaleString();
        const oosTuitionFormatted = school.oos_tuition.toLocaleString();

        // Check if the school is public and add the appropriate tuition info
        if (school.group_type === "PUB") {
          tuitionInfo = `
          
            <i class="bi card-icon"></i> $${tuitionFormatted} In-state Tuition <br>
            <i class="bi bi-cash-stack text-primary me-2"></i> $${oosTuitionFormatted} Out-of-state Tuition
          `;
        } else {
          tuitionInfo = `
            <i class="bi card-icon"></i> $${tuitionFormatted} Tuition <br>
          `;
        }

        /* Makes and displays school information as cards
            Stores school information in "learn More" button to feed into modal content
        */
        const card = `
<div class="col-lg-4 col-md-6 mb-4">
<div class="card school-card shadow-sm border-0 rounded-4">
<div class="card-body p-4">
  <h5 class="card-title fw-bold text-dark mb-3">${school.name}</h5>
  <p class="card-text text-secondary mb-4">
    <i class="bi bi-geo-alt-fill text-danger me-2"></i>${school.location} • ${
          school.group_type
        }       &nbsp;
            <i class="bi bi-book text-info me-2"></i> ${
              school.lsat
            } Avg LSAT <br>

            <i class="bi bi-check-circle-fill text-success me-2"></i>${
              school.acceptance_rate
            }% acceptance rate <br>

    <i class="bi bi-cash-stack text-primary me-2"></i>${tuitionInfo}
  </p>

  <button 
    class="quick-view-btn btn btn-gradient w-100 fw-bold py-2" 
    data-bs-toggle="modal" 
    data-bs-target="#quickViewModal" 
    data-school-name="${school.name}"
    data-school-location="${school.location}"
    data-school-group-type="${school.group_type}"
    data-school-size="${school.size}"
    data-school-acceptance-rate="${school.acceptance_rate}"
    data-school-lsat="${school.lsat}"
    data-school-tuition="${school.tuition.toLocaleString()}"
    data-school-oos-tuition="${school.oos_tuition.toLocaleString()}"
    data-school-gpa="${school.gpa}"
    data-school-description="${school.description}">

    Learn More
  </button>
</div>
</div>
</div>

        `;
        container.innerHTML += card;
      });
    });
});

// Attach event listeners to Learn More buttons
document
  .getElementById("schools-container")
  .addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("quick-view-btn")) {
      // Get the school data from the button's data attributes
      const schoolName = event.target.getAttribute("data-school-name");
      const schoolLocation = event.target.getAttribute("data-school-location");
      const schoolGroupType = event.target.getAttribute(
        "data-school-group-type"
      );
      const schoolSize = event.target.getAttribute("data-school-size");
      const schoolAcceptanceRate = event.target.getAttribute(
        "data-school-acceptance-rate"
      );
      const schoolTuition = event.target.getAttribute("data-school-tuition");
      const schoolOosTuition = event.target.getAttribute(
        "data-school-oos-tuition"
      );
      const schoolGpa = event.target.getAttribute("data-school-gpa");
      const schooldescription = event.target.getAttribute(
        "data-school-description"
      );
      const schoolsat = event.target.getAttribute("data-school-lsat");

      // Populate the modal with the school data
      document.getElementById("quickViewModalLabel").textContent = schoolName;
      document.getElementById("modal-location").textContent = schoolLocation;
      document.getElementById("modal-group-type").textContent = schoolGroupType;
      document.getElementById("modal-size").textContent = schoolSize;
      document.getElementById("modal-acceptance-rate").textContent =
        schoolAcceptanceRate;
      document.getElementById("modal-gpa").textContent = schoolGpa;
      document.getElementById("modal-tuition").textContent =
        schoolTuition.toLocaleString();
      document.getElementById("modal-oos-tuition").textContent =
        schoolOosTuition.toLocaleString();
      document.getElementById("modal-description").textContent =
        schooldescription;
      document.getElementById("modal-lsat").textContent = schoolsat;
    }
  });
