$(document).ready(function () {
  const mockStates = [
    { stateCode: "TG", stateName: "Telangana" },
    { stateCode: "MH", stateName: "Maharashtra" },
    { stateCode: "KA", stateName: "Karnataka" }
  ];

  const mockCities = {
    TG: ["Hyderabad", "Warangal", "Nizamabad"],
    MH: ["Mumbai", "Pune", "Nagpur"],
    KA: ["Bengaluru", "Mysuru", "Hubli"]
  };

  let states = {};

  // Load mock states
  mockStates.forEach(state => {
    $('#stateSelect').append(
      $('<option>', {
        value: state.stateCode,
        text: state.stateName
      })
    );
    states[state.stateCode] = state.stateName;
  });

  // Load cities on state change
  $('#stateSelect').on('change', function () {
    const stateCode = $(this).val();
    $('#citySelect').empty().append('<option value="">--Select City--</option>');
    if (stateCode && mockCities[stateCode]) {
      mockCities[stateCode].forEach(city => {
        $('#citySelect').append(
          $('<option>', {
            value: city,
            text: city
          })
        );
      });
    }
  });

  // Form validation
  $('#dataForm input, #dataForm select').on('input change', function () {
    validateForm();
  });

  function validateForm() {
    let name = $('#name').val().trim();
    let age = parseInt($('#age').val());
    let email = $('#email').val().trim();
    let phone = $('#phone').val().trim();
    let branch = $('input[name="branch"]:checked').val();
    let langs = $('.lang:checked').length;
    let state = $('#stateSelect').val();
    let city = $('#citySelect').val();

    const valid = (
      name !== "" &&
      !isNaN(age) && age > 0 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      /^\d{10}$/.test(phone) &&
      branch &&
      langs > 0 &&
      state &&
      city
    );

    $('#addBtn').prop('disabled', !valid);
  }

  // Add entry to table
  $('#dataForm').on('submit', function (e) {
    e.preventDefault();

    const name = $('#name').val().trim();
    const age = $('#age').val();
    const email = $('#email').val().trim();
    const phone = $('#phone').val().trim();
    const branch = $('input[name="branch"]:checked').val();
    const languages = $('.lang:checked').map(function () {
      return this.value;
    }).get().join(", ");
    const state = states[$('#stateSelect').val()];
    const city = $('#citySelect').val();

    const row = $(`
      <tr>
        <td>${name}</td>
        <td>${age}</td>
        <td>${email}</td>
        <td>${phone}</td>
        <td>${branch}</td>
        <td>${languages}</td>
        <td>${state}</td>
        <td>${city}</td>
        <td><button class="deleteBtn">Delete</button></td>
      </tr>
    `).hide().fadeIn();

    $('#dataTable tbody').append(row);
    updateCount();
    clearForm();
  });

  function clearForm() {
    $('#dataForm')[0].reset();
    $('#citySelect').html('<option value="">--Select City--</option>');
    $('#addBtn').prop('disabled', true);
  }

  // Delete entry
  $('#dataTable').on('click', '.deleteBtn', function () {
    if (confirm("Are you sure you want to delete this entry?")) {
      $(this).closest('tr').fadeOut(300, function () {
        $(this).remove();
        updateCount();
        filterTable();
      });
    }
  });

  // Live search
  $('#searchInput').on('keyup', function () {
    filterTable();
  });

  function filterTable() {
    let query = $('#searchInput').val().toLowerCase();
    let matchCount = 0;

    $('#dataTable tbody tr').each(function () {
      const rowText = $(this).text().toLowerCase();
      const match = rowText.includes(query);
      $(this).toggle(match);
      if (match) matchCount++;
    });

    $('#noResults').toggle(matchCount === 0);
    $('#entryCount').text(`Total Entries: ${matchCount}`);
  }

  function updateCount() {
    const visibleRows = $('#dataTable tbody tr:visible').length;
    $('#entryCount').text(`Total Entries: ${visibleRows}`);
  }
});
