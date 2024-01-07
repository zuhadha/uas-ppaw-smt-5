async function getNgajis() {
    const url = 'https://e-gmm-api-production.up.railway.app/ngajis';

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            const filteredData = filterByName(data);
            displayNgajis(filteredData);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function searchNgajis(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const searchTerm = document.getElementById('search').value;
    const data = await fetchData();

    const filteredData = filterByName(data, searchTerm);
    displayNgajis(filteredData);

    return false; // Prevent the form from submitting and refreshing the page
}

async function fetchData() {
    const url = 'https://e-gmm-api-production.up.railway.app/ngajis';

    try {
        const response = await fetch(url);
        return response.ok ? await response.json() : [];
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

function filterByName(data, searchTerm) {
    if (!searchTerm) {
        return data;
    }

    const filteredData = data.filter(ngaji => ngaji.studentsName.toLowerCase().includes(searchTerm.toLowerCase()));
    return filteredData;
}


function displayNgajis(ngajis) {
    const ngajisTable = document.getElementById('ngajisTable');
    ngajisTable.innerHTML = ''; // Clear previous content

    // Create table header
    const tableHeader = document.createElement('tr');
    tableHeader.innerHTML = '<th class="cell-padding">Student Name</th><th class="cell-padding">Teacher Name</th><th class="cell-padding">Date</th><th class="cell-padding">Surah Read</th><th class="cell-padding">Ayah Read</th><th class="cell-padding">Surah Memorize</th><th class="cell-padding">Ayah Memorize</th><th class="cell-padding">&nbspActions&nbsp</th>';
    ngajisTable.appendChild(tableHeader);

    // Create table rows
    ngajis.forEach((ngaji, index) => {
        // Format the date
        const formattedDate = new Date(ngaji.date).toLocaleDateString();

        const row = document.createElement('tr');
        row.innerHTML = `<td class="cell-padding">${ngaji.studentsName}</td>
                         <td class="cell-padding">${ngaji.teachersName}</td>
                         <td class="cell-padding">${formattedDate}</td>
                         <td class="cell-padding">${ngaji.surahRead}</td>
                         <td class="cell-padding center-text">${ngaji.ayahRead}</td>
                         <td class="cell-padding">${ngaji.surahMemorize}</td>
                         <td class="cell-padding center-text">${ngaji.ayahMemorize}</td>
                         <td class="cell-padding">
                            <a href="editNgajiPage.html?id=${ngaji._id}" class="edit-btn"><i class="fas fa-pencil-alt"></i></a>
                            <button class="delete-btn" onclick="deleteNgaji('${ngaji._id}')"><i class="fas fa-trash"></i></button>
                         </td>`;

        ngajisTable.appendChild(row);
    });

    document.getElementById('batasNgajiPage').style.display = 'block';
}

async function editNgaji(id) {
    // Fetch the existing record
    const url = `https://e-gmm-api-production.up.railway.app/ngajis/${id}`;

    try {
        const response = await fetch(url);
        const ngaji = await response.json();

        if (response.ok) {
            // Open a modal or form with the current values of the record
            const updatedNgaji = prompt('Edit Ngaji', JSON.stringify(ngaji));

            // If the user clicks "OK" and provides valid input, send a request to update the record
            if (updatedNgaji) {
                try {
                    const updateResponse = await fetch(url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: updatedNgaji,
                    });

                    if (updateResponse.ok) {
                        console.log('Ngaji updated successfully.');
                        getNgajis(); // Refresh the table after update
                    } else {
                        const errorData = await updateResponse.json();
                        console.error('Error:', errorData.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function deleteNgaji(id) {
    // Display a confirmation dialog
    const isConfirmed = window.confirm('Are you sure you want to delete this record?');

    // If the user confirms, proceed with deletion
    if (isConfirmed) {
        const url = `https://e-gmm-api-production.up.railway.app/ngajis/${id}`;

        try {
            const response = await fetch(url, { method: 'DELETE' });

            if (response.ok) {
                console.log('Ngaji deleted successfully.');
                getNgajis(); // Refresh the table after deletion
            } else {
                const errorData = await response.json();
                console.error('Error:', errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
}


async function login() {
    // Check if the username and password fields are empty
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!username || !password) {
        // If either field is empty, do not proceed with the login
        return;
    }

    // Continue with the login request
    const url = 'https://e-gmm-api-production.up.railway.app/users/login';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = 'batasNgajiPage.html';
            document.getElementById('loginForm').style.display = 'none';
            document.getElementById('batasNgajiPage').style.display = 'block';

        } else {
            const errorData = await response.json();
            alert(`Login failed. ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function addNgaji() {
    // Get input values from the form
    //window.location.href = `editNgajiPage.html?id=${id}`;
    const studentsName = document.getElementById('studentsName').value;
    const teachersName = document.getElementById('teachersName').value;
    const date = document.getElementById('date').value;
    const surahRead = document.getElementById('surahRead').value;
    const ayahRead = document.getElementById('ayahRead').value;
    const surahMemorize = document.getElementById('surahMemorize').value;
    const ayahMemorize = document.getElementById('ayahMemorize').value;

    // Create the ngaji record object
    const ngajiData = {
        studentsName,
        teachersName,
        date,
        surahRead,
        ayahRead,
        surahMemorize,
        ayahMemorize,
    };

    // You need to replace the following URL with your actual ngaji records endpoint
    const url = 'https://e-gmm-api-production.up.railway.app/ngajis';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ngajiData),
        });

        if (response.ok) {
            // Ngaji record added successfully
            const confirmation = confirm('Ngaji record added successfully. Do you want to add another record?');

            if (confirmation) {
                const ngajiForm = document.getElementById('addNgajiForm');
                ngajiForm.querySelectorAll('input').forEach(input => {
                    input.value = ''; // Clear the value of each input field
                });
            } else {
                // If the user doesn't want to add another record, redirect to batasNgajiPage.html
                window.location.href = 'batasNgajiPage.html';
            }
        } else {
            const errorData = await response.json();
            alert(`Error adding ngaji record. ${errorData.message}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}


// edit ngaji record
// script.js

async function updateNgaji(id) {
    // Get the Ngaji ID from the URL or any other source
    const ngajiId = id;
    console.log(ngajiId);

    // Get updated values from the form
    const studentsName = document.getElementById('studentsName').value;
    const teachersName = document.getElementById('teachersName').value;
    const date = document.getElementById('date').value;
    const surahRead = document.getElementById('surahRead').value;
    const ayahRead = document.getElementById('ayahRead').value;
    const surahMemorize = document.getElementById('surahMemorize').value;
    const ayahMemorize = document.getElementById('ayahMemorize').value;

    // Construct the updated Ngaji object
    const updatedNgaji = {
        studentsName,
        teachersName,
        date,
        surahRead,
        ayahRead,
        surahMemorize,
        ayahMemorize,
    };

    const url = `https://e-gmm-api-production.up.railway.app/ngajis/${ngajiId}`;

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedNgaji),
        });

        if (response.ok) {
            console.log('Ngaji updated successfully.');
            window.location.href = 'batasNgajiPage.html';

        } else {
            const errorData = await response.json();
            console.error('Error:', errorData.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function getNgajiIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}


// fetch data to the form
async function fetchNgajiById(id) {
    const url = `https://e-gmm-api-production.up.railway.app/ngajis/${id}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            // If the request is successful, populate the form with the fetched data
            populateForm(data);
        } else {
            console.error('Error:', data.message);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function populateForm(ngaji) {
    // Format the date to "yyyy-MM-dd"
    const formattedDate = new Date(ngaji.date).toISOString().split('T')[0];

    // Populate the form fields with the Ngaji data
    document.getElementById('studentsName').value = ngaji.studentsName;
    document.getElementById('teachersName').value = ngaji.teachersName;
    document.getElementById('date').value = formattedDate; // Use the formatted date
    document.getElementById('surahRead').value = ngaji.surahRead;
    document.getElementById('ayahRead').value = ngaji.ayahRead;
    document.getElementById('surahMemorize').value = ngaji.surahMemorize;
    document.getElementById('ayahMemorize').value = ngaji.ayahMemorize;
}