(() => {
    
    // Set up users array
    let users = [];
    
    // Close modal
    document.getElementsByClassName("close")[0].addEventListener("click", (e) => {
        document.getElementsByClassName("modal-overlay")[0].style.display = "none";
    });
    
    // Get 12 random users (image, first last name, email, city, username, cell, birthday, address)
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            // parse json
            let json = JSON.parse(xhr.responseText);
            users = formatData(json.results);
            createCards();
        }
    };
    xhr.open("GET", "https://randomuser.me/api/?nat=AU&exc=gender,registered,id,nat,phone&noinfo&results=12");
    xhr.send();
    
    // Format the data (we only want certain pieces of data)
    const formatData = data => {
        
        let newData = data.map((current) => {
            let newValue = {};
            // Basic data
            newValue.cell = current.cell;
            newValue.email = current.email;
            newValue.location = current.location.street + ", " + current.location.city + ", " + current.location.state + " " + current.location.postcode;
            newValue.state = current.location.state;
            newValue.username = current.login.username;
            newValue.name = current.name.first + " " + current.name.last;
            newValue.icon = current.picture.large;
            // Date manipulation
            const date = current.dob;
            let newDate = date.substr(5, 5) + "-" + date.substr(0, 4);
            newValue.dob = newDate;
            return newValue;
        });
        
        return newData;
        
    };
    
    // Loop through users array and create a card for each
    const createCards = () => {
      
        let html = ``;
        for (let i = 0; i < users.length; i++) {
            
            let user = users[i];
            
            // Create the employee card
            html += `
            <div class="employee" employee="${i}">
                <img src="${user.icon}" class="employee-icon" alt="${user.name}">
                <div class="employee-info">
                    <h4>${user.name}</h4>
                    <span>${user.email}</span>
                    <span>${user.state}</span>
                </div><!-- End employee info -->
            </div><!-- End employee -->
            `;
            
        }
        
        // Insert the HTML
        document.querySelector(".employees").innerHTML = html;
        
        // On click of card, load info into modal
        let cards = document.querySelectorAll(".employee");
        for (let i = 0; i < cards.length; i++) {
            cards[i].addEventListener("click", (e) => {
                loadModal(cards[i].getAttribute("employee"));
            });
        }
        
         // On change of search bar value, filter results 
    document.querySelector(".search").addEventListener("keyup", (e) => {
        let search = document.querySelector(".search").value.toLowerCase();
        let matches = [];
        // Loop through array and fine matching username or name
        let user = null;
        for (let i = 0; i < users.length; i++) {
            user = users[i];
            if (user.username.search(search) != -1 || user.name.search(search) != -1) {
                matches.push(i);
            }
        }
        // Filter those results
        // Hide ones not in matches
        let cards = document.querySelectorAll(".employee");
        for (let i = 0; i < users.length; i++) {
            if (matches.indexOf(i) == -1) {
                // Hide
                cards[i].style.display = "none";
            } else {
                cards[i].style.display = "inline-block";
            }
        }
    });
        
    };
    
    // Load modal with info
    const loadModal = id => {
        
        const user = users[id];
        const html = `<span style='display: none;' id='employee-id'>${id}</span><img src="${user.icon}" class="employee-icon" alt="${user.name}">
        <div class="employee-info">
            <h4>${user.name}</h4>
            <span>Username: ${user.username}</span>
            <span>${user.email}</span>
            <span>${user.state}</span>
            <hr>
            <span>${user.cell}</span>
            <span>${user.location}</span>
            <span>Birthday: ${user.dob}</span>
        </div>`;
        
        // Put into modal
        document.querySelector(".modal-content").innerHTML = html;
        
        // Show modal
        document.querySelector(".modal-overlay").style.display = "block";
        
    };
    
    
    // On click of prev arrow button
    document.querySelector("#prev").addEventListener("click", (e) => {
        // Get current employee ID
        let id = parseInt(document.querySelector("#employee-id").innerHTML);
        // Subtract data ID, load new content
        let newID = 11;
        if (id !== 0) {
            newID = id - 1;
        }
        loadModal(newID);
    });
    // On click of next button
    document.querySelector("#next").addEventListener("click", (e) => {
        // Get current employee ID
        let id = parseInt(document.querySelector("#employee-id").innerHTML);
        // Add data ID, load new content
        let newID = 0;
        if (id !== 11) {
            newID = id + 1;
        }
        loadModal(newID);
    });
    
    
})();